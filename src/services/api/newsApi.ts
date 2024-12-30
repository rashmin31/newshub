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
            sortBy: "publishedAt",
        };

        // Define valid NewsAPI categories
        const validCategories = [
            "business",
            "entertainment",
            "general",
            "health",
            "science",
            "sports",
            "technology",
        ];

        let endpoint = "/everything";

        if (params.category) {
            const categories = params.category.split(",");
            const validSelectedCategories = categories.filter((cat) =>
                validCategories.includes(cat.toLowerCase())
            );

            // Get all available categories
            const allCategories = await this.getCategories();

            // Only use top-headlines with category if not all categories are selected
            // and exactly one valid category is selected
            if (
                categories.length !== allCategories.length &&
                validSelectedCategories.length === 1
            ) {
                endpoint = "/top-headlines";
                searchParamsObj.category =
                    validSelectedCategories[0].toLowerCase();
            } else {
                searchParamsObj.q = params.query || "news";
                if (params.fromDate) {
                    searchParamsObj.from = params.fromDate;
                } else {
                    searchParamsObj.from = oneMonthAgo
                        .toISOString()
                        .split("T")[0];
                }
            }
        } else {
            searchParamsObj.q = params.query || "news";
            if (params.fromDate) {
                searchParamsObj.from = params.fromDate;
            } else {
                searchParamsObj.from = oneMonthAgo.toISOString().split("T")[0];
            }
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
                category: "",
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
            "World",
            "U.S.",
            "Politics",
            "Business",
            "Technology",
            "Science",
            "Health",
            "Sports",
            "Arts",
            "Books",
            "Style",
            "Food",
            "Travel",
        ];
    },
};
