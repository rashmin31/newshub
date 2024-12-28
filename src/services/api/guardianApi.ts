import {
    GuardianResponse,
    NewsSearchParams,
    UnifiedArticle,
} from "../../types/news";
import { API_KEYS, API_ENDPOINTS } from "./config";
import { rateLimiter, RateLimitError } from "../rateLimiter";

export const guardianApi = {
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
            const searchParams = new URLSearchParams({
                "api-key": API_KEYS.GUARDIAN_API_KEY,
                "show-fields": "headline,trailText,body,thumbnail",
                "page-size": params.pageSize?.toString() || "10",
                page: params.page?.toString() || "1",
            });

            if (params.query) searchParams.append("q", params.query);
            if (params.category)
                searchParams.append("section", params.category);
            if (params.fromDate)
                searchParams.append("from-date", params.fromDate);
            if (params.toDate) searchParams.append("to-date", params.toDate);

            const response = await fetch(
                `${API_ENDPOINTS.GUARDIAN}/search?${searchParams}`,
                { signal }
            );

            // Handle 429 Too Many Requests
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

            const data: GuardianResponse = await response.json();
            rateLimiter.logRequest("guardian");

            return data.response.results.map((article) => ({
                articleId: article.id,
                title: article.webTitle,
                description: article.fields?.trailText || "",
                content: article.fields?.body || "",
                publishedAt: new Date(article.webPublicationDate),
                source: "The Guardian",
                url: article.webUrl,
                urlToImage: article.fields?.thumbnail || null,
                category: article.sectionName,
            }));
        } catch (error: any) {
            if (error.name === "AbortError") {
                throw error; // Re-throw abort errors
            }
            // Check if error is from fetch request and is 429
            if (
                error instanceof Error &&
                "status" in error &&
                (error as any).status === 429
            ) {
                rateLimiter.markRateLimited("guardian");
                throw new RateLimitError(
                    `Guardian API rate limit exceeded. Please try again later.`
                );
            }
            console.error("Error fetching from Guardian API:", error);
            throw error;
        }
    },

    getRemainingRequests(): number {
        return rateLimiter.getRemainingRequests("guardian");
    },

    async getCategories(): Promise<string[]> {
        try {
            const response = await fetch(
                `${API_ENDPOINTS.GUARDIAN}/sections?api-key=${API_KEYS.GUARDIAN_API_KEY}`
            );

            if (!response.ok) {
                console.warn(
                    "Failed to fetch Guardian API sections, using default sections"
                );
                // Fallback to default sections if API fails
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
            }

            const data = await response.json();
            return data.response.results.map(
                (section: any) => section.webTitle
            );
        } catch (error) {
            console.error("Error fetching Guardian API sections:", error);
            // Return default sections on error
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
        }
    },
};
