import {
    NewsAPIErrorResponse,
    NewsAPIResponse,
    NewsAPISuccessResponse,
    NewsSearchParams,
    UnifiedArticle,
} from "../../types/news";
import { API_ENDPOINTS, API_KEYS } from "./config";
import { rateLimiter, RateLimitError } from "../rateLimiter";

export const newsApi = {
    async fetchArticles(
        params: NewsSearchParams,
        signal?: AbortSignal
    ): Promise<UnifiedArticle[]> {
        if (!rateLimiter.checkLimit("newsapi")) {
            const resetTime = rateLimiter.getResetTime("newsapi");
            throw new RateLimitError(
                `NewsAPI rate limit exceeded. Resets at ${resetTime.toLocaleString()}`
            );
        }

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const searchParamsObj: Record<string, string> = {
            apiKey: API_KEYS.NEWSAPI_API_KEY,
            pageSize: params.pageSize?.toString() || "10",
            page: params.page?.toString() || "1",
        };

        let endpoint = "/everything";

        if (params.category) {
            endpoint = "/top-headlines";
            searchParamsObj.category = params.category;
        } else {
            searchParamsObj.q = params.query || "news";
            searchParamsObj.sortBy = "publishedAt";
            searchParamsObj.from =
                params.fromDate || oneMonthAgo.toISOString().split("T")[0];
        }

        const searchParams = new URLSearchParams(searchParamsObj);

        try {
            const response = await fetch(
                `${API_ENDPOINTS.NEWSAPI}${endpoint}?${searchParams}`,
                { signal }
            );

            // Handle 429 Too Many Requests
            if (response.status === 429) {
                rateLimiter.markRateLimited("newsapi");
                const resetTime = response.headers.get("x-ratelimit-reset");
                const resetDate = resetTime
                    ? new Date(parseInt(resetTime) * 1000)
                    : rateLimiter.getResetTime("newsapi");

                throw new RateLimitError(
                    `NewsAPI rate limit exceeded. Resets at ${resetDate.toLocaleString()}`
                );
            }

            if (!response.ok) {
                throw new Error(
                    `NewsAPI responded with status: ${response.status}`
                );
            }

            const data: NewsAPIResponse = await response.json();
            rateLimiter.logRequest("newsapi");

            if (data.status === "error") {
                console.warn(
                    "NewsAPI warning:",
                    (data as NewsAPIErrorResponse).message
                );
                return [];
            }

            return (data as NewsAPISuccessResponse).articles.map((article) => ({
                articleId: `${article.source.name}-${article.publishedAt}`,
                title: article.title,
                description: article.description,
                content: article.content,
                publishedAt: new Date(article.publishedAt),
                source: article.source.name,
                url: article.url,
                urlToImage: article.urlToImage,
                category: params.category || "general",
                author: article.author || undefined,
            }));
        } catch (error: any) {
            if (error.name === "AbortError") {
                throw error; // Re-throw abort errors
            }
            console.error("Error fetching from NewsAPI:", error);
            throw error;
        }
    },

    getRemainingRequests(): number {
        return rateLimiter.getRemainingRequests("newsapi");
    },

    async getCategories(): Promise<string[]> {
        // NewsAPI has fixed categories
        return [
            "business",
            "entertainment",
            "general",
            "health",
            "science",
            "sports",
            "technology",
        ];
    },
};
