// src/services/api/newsApi.ts
import {
    NewsAPIErrorResponse,
    NewsAPIResponse,
    NewsAPISuccessResponse,
    NewsSearchParams,
    UnifiedArticle,
} from "../../types/news";
import { API_KEYS, API_ENDPOINTS } from "./config";
import { rateLimiter, RateLimitError } from "../rateLimiter";
import { transformers } from "../../utils/apiTransformers";

// Constants
const DEFAULT_PAGE_SIZE = 10;
const VALID_CATEGORIES = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
];

const DEFAULT_CATEGORIES = [
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

/**
 * Builds search parameters for the NewsAPI
 */
const buildSearchParams = async (
    params: NewsSearchParams
): Promise<[string, URLSearchParams]> => {
    let endpoint = "/everything";
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const searchParamsObj: Record<string, string> = {
        apiKey: API_KEYS.NEWSAPI_API_KEY,
        pageSize: params.pageSize?.toString() || DEFAULT_PAGE_SIZE.toString(),
        page: params.page?.toString() || "1",
        sortBy: "publishedAt",
    };

    if (params.category) {
        const categories = params.category.split(",");
        const validSelectedCategories = categories.filter((cat) =>
            VALID_CATEGORIES.includes(cat.toLowerCase())
        );

        // Get all available categories
        const allCategories = DEFAULT_CATEGORIES;

        // Use top-headlines with category if not all categories are selected
        // and exactly one valid category is selected
        if (
            categories.length < allCategories.length &&
            validSelectedCategories.length === 1
        ) {
            endpoint = "/top-headlines";
            searchParamsObj.category = validSelectedCategories[0].toLowerCase();
        } else {
            searchParamsObj.q = params.query || "news";
            if (params.fromDate) {
                searchParamsObj.from = params.fromDate;
            } else {
                searchParamsObj.from = oneMonthAgo.toISOString().split("T")[0];
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

    return [endpoint, new URLSearchParams(searchParamsObj)];
};

/**
 * Handles API response and error checking
 */
const handleResponse = async (response: Response): Promise<NewsAPIResponse> => {
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
        throw new Error(`NewsAPI responded with status: ${response.status}`);
    }

    return await response.json();
};

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

        try {
            const [endpoint, searchParams] = await buildSearchParams(params);
            const response = await fetch(
                `${API_ENDPOINTS.NEWSAPI}${endpoint}?${searchParams}`,
                { signal }
            );

            const data = await handleResponse(response);
            rateLimiter.logRequest("newsapi");

            if (data.status === "error") {
                console.warn(
                    "NewsAPI warning:",
                    (data as NewsAPIErrorResponse).message
                );
                return [];
            }

            return (data as NewsAPISuccessResponse).articles.map(
                transformers.newsApiToUnified
            );
        } catch (error: any) {
            if (error.name === "AbortError") {
                throw error;
            }
            console.error("Error fetching from NewsAPI:", error);
            throw error;
        }
    },

    getRemainingRequests(): number {
        return rateLimiter.getRemainingRequests("newsapi");
    },

    async getCategories(): Promise<string[]> {
        return DEFAULT_CATEGORIES;
    },
};
