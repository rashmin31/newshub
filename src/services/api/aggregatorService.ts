import {
    UnifiedArticle,
    NewsSearchParams,
    ApiMetadata,
} from "../../types/news";
import { guardianApi } from "./guardianApi";
import { nyTimesApi } from "./nyTimesApi";
import { newsApi } from "./newsApi";
import { rateLimiter, RateLimitError } from "../rateLimiter";

type ApiSource = {
    name: string;
    api: typeof guardianApi | typeof nyTimesApi | typeof newsApi;
};

interface ApiStatus {
    guardian: { remaining: number; isLimited: boolean };
    nytimes: { remaining: number; isLimited: boolean };
    newsapi: { remaining: number; isLimited: boolean };
}

class AggregatorService {
    private readonly apis: ApiSource[] = [
        { api: guardianApi, name: "The Guardian" },
        { api: nyTimesApi, name: "The New York Times" },
        { api: newsApi, name: "NewsAPI" },
    ];

    async fetchAllArticles(
        params: NewsSearchParams,
        signal?: AbortSignal
    ): Promise<{
        articles: UnifiedArticle[];
        rateLimitedApis: string[];
    }> {
        const results: UnifiedArticle[][] = [];
        const rateLimitedApis: string[] = [];

        // Split the source parameter if it exists
        const selectedSources = params.source ? params.source.split(",") : [];

        // Determine which APIs to call
        const apisToCall =
            selectedSources.length > 0
                ? this.apis.filter(({ name }) => selectedSources.includes(name))
                : [];

        // If no APIs to call, return early
        if (apisToCall.length === 0) {
            console.warn(
                "No sources selected or available. Skipping API calls."
            );
            return {
                articles: [],
                rateLimitedApis: [],
            };
        }

        for (const { api, name } of apisToCall) {
            try {
                // Create a new params object without the source parameter
                // as each API already knows its own source
                const apiParams = {
                    ...params,
                    source: undefined, // Remove source from params as it's handled by each API
                };

                const articles = await api.fetchArticles(apiParams, signal);
                results.push(articles);
            } catch (error: any) {
                if (error.name === "AbortError") {
                    throw error; // Re-throw abort errors
                }
                if (
                    error instanceof RateLimitError ||
                    (error instanceof Error && error.message.includes("429"))
                ) {
                    console.warn(`${name} API rate limited:`, error.message);
                    rateLimitedApis.push(name);
                    continue;
                }
                console.error(`${name} API error:`, error);
                continue;
            }
        }

        // If all APIs are rate limited, throw error
        if (rateLimitedApis.length === apisToCall.length) {
            throw new RateLimitError(
                "All selected news sources are currently rate limited. Please try again later."
            );
        }

        // Combine and sort results from successful API calls
        const articles = results
            .flat()
            .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

        return {
            articles,
            rateLimitedApis,
        };
    }

    getApiStatus(): ApiStatus {
        return {
            guardian: {
                remaining: guardianApi.getRemainingRequests(),
                isLimited: !rateLimiter.checkLimit("guardian"),
            },
            nytimes: {
                remaining: nyTimesApi.getRemainingRequests(),
                isLimited: !rateLimiter.checkLimit("nytimes"),
            },
            newsapi: {
                remaining: newsApi.getRemainingRequests(),
                isLimited: !rateLimiter.checkLimit("newsapi"),
            },
        };
    }

    async fetchPaginatedArticles(
        params: NewsSearchParams & { page: number; pageSize: number }
    ): Promise<{
        articles: UnifiedArticle[];
        hasMore: boolean;
        rateLimitedApis: string[];
    }> {
        // Fetch extra items to determine if there are more pages
        const extendedParams = {
            ...params,
            pageSize: params.pageSize,
        };

        try {
            const { articles, rateLimitedApis } = await this.fetchAllArticles(
                extendedParams
            );

            // Calculate if there are more articles
            const hasMore = articles.length > params.pageSize;

            return {
                articles: articles.slice(0, params.pageSize),
                hasMore,
                rateLimitedApis,
            };
        } catch (error) {
            console.error("Error fetching paginated articles:", error);
            throw error;
        }
    }

    async getMetadata(): Promise<ApiMetadata> {
        try {
            const [guardianCats, nyTimesCats, newsApiCats] = await Promise.all([
                guardianApi.getCategories(),
                nyTimesApi.getCategories(),
                newsApi.getCategories(),
            ]);

            const metadata: ApiMetadata = {
                categories: {
                    guardian: guardianCats,
                    nytimes: nyTimesCats,
                    newsapi: newsApiCats,
                },
                sources: ["The Guardian", "The New York Times", "NewsAPI"],
            };

            return metadata;
        } catch (error) {
            console.error("Error fetching API metadata:", error);
            throw error;
        }
    }
}

// Export a singleton instance
export const aggregatorService = new AggregatorService();
