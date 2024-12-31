// src/services/api/nyTimesApi.ts
import {
    NYTimesResponse,
    NewsSearchParams,
    UnifiedArticle,
} from "../../types/news";
import { API_KEYS, API_ENDPOINTS } from "./config";
import { rateLimiter, RateLimitError } from "../rateLimiter";
import { transformers } from "../../utils/apiTransformers";

// Constants
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
 * Builds search parameters for the NY Times API
 */
const buildSearchParams = async (
    params: NewsSearchParams
): Promise<URLSearchParams> => {
    const searchParams = new URLSearchParams({
        "api-key": API_KEYS.NYTIMES_API_KEY,
        page: params.page?.toString() || "1",
    });

    if (params.query) {
        searchParams.append("q", params.query);
    }

    // Handle category filtering
    if (params.category) {
        const categories = params.category.split(",");
        // Get all available categories
        const allCategories = await nyTimesApi.getCategories();

        // If not all categories are selected, apply filter with first category
        if (categories.length < allCategories.length) {
            searchParams.append("fq", `section_name:${categories[0]}`);
        }
    }

    if (params.fromDate) {
        searchParams.append("begin_date", params.fromDate.replace(/-/g, ""));
    }

    if (params.toDate) {
        searchParams.append("end_date", params.toDate.replace(/-/g, ""));
    }

    return searchParams;
};

/**
 * Handles API response and error checking
 */
const handleResponse = async (response: Response): Promise<NYTimesResponse> => {
    if (response.status === 429) {
        rateLimiter.markRateLimited("nytimes");
        const resetTime = response.headers.get("x-ratelimit-reset");
        const resetDate = resetTime
            ? new Date(parseInt(resetTime) * 1000)
            : rateLimiter.getResetTime("nytimes");

        throw new RateLimitError(
            `NY Times API rate limit exceeded. Resets at ${resetDate.toLocaleString()}`
        );
    }

    if (!response.ok) {
        throw new Error(
            `NY Times API responded with status: ${response.status}`
        );
    }

    return await response.json();
};

export const nyTimesApi = {
    async fetchArticles(
        params: NewsSearchParams,
        signal?: AbortSignal
    ): Promise<UnifiedArticle[]> {
        if (!rateLimiter.checkLimit("nytimes")) {
            const resetTime = rateLimiter.getResetTime("nytimes");
            throw new RateLimitError(
                `NY Times API rate limit exceeded. Resets at ${resetTime.toLocaleString()}`
            );
        }

        try {
            const searchParams = await buildSearchParams(params);
            const response = await fetch(
                `${API_ENDPOINTS.NYTIMES}search/v2/articlesearch.json?${searchParams}`,
                { signal }
            );

            const data = await handleResponse(response);
            rateLimiter.logRequest("nytimes");

            return data.response.docs.map(transformers.nyTimesToUnified);
        } catch (error: any) {
            if (error.name === "AbortError") {
                throw error;
            }
            console.error("Error fetching from NY Times API:", error);
            throw error;
        }
    },

    getRemainingRequests(): number {
        return rateLimiter.getRemainingRequests("nytimes");
    },

    async getCategories(): Promise<string[]> {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.NYTIMES}news/v3/content/section-list.json?api-key=${API_KEYS.NYTIMES_API_KEY}`
            );

            if (!response.ok) {
                console.warn(
                    "Failed to fetch NY Times sections, using default sections"
                );
                return DEFAULT_CATEGORIES;
            }

            const data = await response.json();
            return data.results.map((section: any) => section.display_name);
        } catch (error) {
            console.error("Error fetching NY Times sections:", error);
            return DEFAULT_CATEGORIES;
        }
    },
};
