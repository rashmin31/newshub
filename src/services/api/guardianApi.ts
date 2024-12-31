// src/services/api/guardianApi.ts
import {
    GuardianResponse,
    NewsSearchParams,
    UnifiedArticle,
} from "../../types/news";
import { API_KEYS, API_ENDPOINTS } from "./config";
import { rateLimiter, RateLimitError } from "../rateLimiter";
import { transformers } from "../../utils/apiTransformers";

// Constants
const DEFAULT_PAGE_SIZE = 10;
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
];
const REQUIRED_FIELDS = "headline,trailText,body,thumbnail";

/**
 * Builds search parameters for the Guardian API
 */
const buildSearchParams = async (
    params: NewsSearchParams
): Promise<URLSearchParams> => {
    const searchParams = new URLSearchParams({
        "api-key": API_KEYS.GUARDIAN_API_KEY,
        "show-fields": REQUIRED_FIELDS,
        "page-size":
            params.pageSize?.toString() || DEFAULT_PAGE_SIZE.toString(),
        page: params.page?.toString() || "1",
    });

    // Add query parameter if present
    if (params.query) {
        searchParams.append("q", params.query);
    }

    // Add date range if present
    if (params.fromDate) {
        searchParams.append("from-date", params.fromDate);
    }
    if (params.toDate) {
        searchParams.append("to-date", params.toDate);
    }

    // Handle category filtering
    if (params.category) {
        const categories = params.category.split(",");
        // Only add category to query if not all categories are selected
        // Get all available categories
        const allCategories = await guardianApi.getCategories();
        if (categories.length < allCategories.length) {
            const categoryQuery = params.category
                .split(",")
                .join(" OR ")
                .toLowerCase();
            const existingQuery = searchParams.get("q");
            searchParams.set(
                "q",
                existingQuery
                    ? `${existingQuery} ${categoryQuery}`
                    : categoryQuery
            );
        }
    }

    return searchParams;
};

/**
 * Handles API response and error checking
 */
const handleResponse = async (
    response: Response
): Promise<GuardianResponse> => {
    if (response.status === 429) {
        rateLimiter.markRateLimited("guardian");
        const resetTime = response.headers.get("x-ratelimit-reset");
        const resetDate = resetTime
            ? new Date(parseInt(resetTime) * 1000)
            : rateLimiter.getResetTime("guardian");

        throw new RateLimitError(
            `Guardian API rate limit exceeded. Resets at ${resetDate.toLocaleString()}`
        );
    }

    if (!response.ok) {
        throw new Error(
            `Guardian API responded with status: ${response.status}`
        );
    }

    return await response.json();
};

/**
 * Main API object with public methods
 */
export const guardianApi = {
    /**
     * Fetches articles from the Guardian API
     */
    async fetchArticles(
        params: NewsSearchParams,
        signal?: AbortSignal
    ): Promise<UnifiedArticle[]> {
        if (!rateLimiter.checkLimit("guardian")) {
            const resetTime = rateLimiter.getResetTime("guardian");
            throw new RateLimitError(
                `Guardian API rate limit exceeded. Resets at ${resetTime.toLocaleString()}`
            );
        }

        try {
            const searchParams = await buildSearchParams(params);
            const response = await fetch(
                `${API_ENDPOINTS.GUARDIAN}/search?${searchParams}`,
                { signal }
            );

            const data = await handleResponse(response);
            rateLimiter.logRequest("guardian");

            return data.response.results.map(transformers.guardianToUnified);
        } catch (error: any) {
            if (error.name === "AbortError") {
                throw error;
            }
            console.error("Error fetching from Guardian API:", error);
            throw error;
        }
    },

    /**
     * Gets remaining API requests
     */
    getRemainingRequests(): number {
        return rateLimiter.getRemainingRequests("guardian");
    },

    /**
     * Fetches available categories from the Guardian API
     */
    async getCategories(): Promise<string[]> {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.GUARDIAN}/sections?api-key=${API_KEYS.GUARDIAN_API_KEY}`
            );

            if (!response.ok) {
                console.warn(
                    "Failed to fetch Guardian API sections, using default sections"
                );
                return DEFAULT_CATEGORIES;
            }

            const data = await response.json();
            return data.response.results.map(
                (section: any) => section.webTitle
            );
        } catch (error) {
            console.error("Error fetching Guardian API sections:", error);
            return DEFAULT_CATEGORIES;
        }
    },
};
