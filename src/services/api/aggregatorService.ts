import { UnifiedArticle, NewsSearchParams } from "../../types/news";
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
        { api: guardianApi, name: "Guardian" },
        { api: nyTimesApi, name: "NY Times" },
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

        for (const { api, name } of this.apis) {
            try {
                const articles = await api.fetchArticles(params, signal);
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
                // For non-rate-limit errors, still continue with other APIs
                continue;
            }
        }

        // If all APIs are rate limited, throw error
        if (rateLimitedApis.length === this.apis.length) {
            throw new RateLimitError(
                "All news sources are currently rate limited. Please try again later."
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
            pageSize: params.pageSize + 1,
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

    async searchArticles(params: NewsSearchParams): Promise<{
        articles: UnifiedArticle[];
        rateLimitedApis: string[];
    }> {
        try {
            // First try with exact parameters
            const result = await this.fetchAllArticles(params);

            // If no results, try with relaxed parameters
            if (result.articles.length === 0 && params.query) {
                // Try with just the search query, removing other filters
                return await this.fetchAllArticles({ query: params.query });
            }

            return result;
        } catch (error) {
            console.error("Error searching articles:", error);
            throw error;
        }
    }

    async fetchArticlesByCategory(
        category: string,
        params: Omit<NewsSearchParams, "category">
    ): Promise<{
        articles: UnifiedArticle[];
        rateLimitedApis: string[];
    }> {
        return this.fetchAllArticles({ ...params, category });
    }

    async fetchArticlesBySource(
        source: string,
        params: Omit<NewsSearchParams, "source">
    ): Promise<{
        articles: UnifiedArticle[];
        rateLimitedApis: string[];
    }> {
        return this.fetchAllArticles({ ...params, source });
    }

    async fetchArticlesByDateRange(
        fromDate: string,
        toDate: string,
        params: Omit<NewsSearchParams, "fromDate" | "toDate">
    ): Promise<{
        articles: UnifiedArticle[];
        rateLimitedApis: string[];
    }> {
        return this.fetchAllArticles({ ...params, fromDate, toDate });
    }

    getAvailableApis(): string[] {
        return this.apis
            .filter(({ name }) =>
                rateLimiter.checkLimit(
                    name.toLowerCase().replace(" ", "") as any
                )
            )
            .map(({ name }) => name);
    }

    hasAvailableApis(): boolean {
        return this.getAvailableApis().length > 0;
    }
}

// Export a singleton instance
export const aggregatorService = new AggregatorService();
