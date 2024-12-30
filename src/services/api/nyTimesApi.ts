import {
    NYTimesResponse,
    NewsSearchParams,
    UnifiedArticle,
} from "../../types/news";
import { API_KEYS, API_ENDPOINTS } from "./config";
import { rateLimiter, RateLimitError } from "../rateLimiter";

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
            const searchParams = new URLSearchParams({
                "api-key": API_KEYS.NYTIMES_API_KEY,
                page: params.page?.toString() || "1",
            });

            if (params.query) searchParams.append("q", params.query);

            // Handle category filtering
            if (params.category) {
                const categories = params.category.split(",");
                // Get all available categories
                const allCategories = await this.getCategories();

                // If not all categories are selected, apply filter with first category
                if (categories.length !== allCategories.length) {
                    searchParams.append("fq", `section_name:${categories[0]}`);
                }
            }

            if (params.fromDate) {
                searchParams.append(
                    "begin_date",
                    params.fromDate.replace(/-/g, "")
                );
            }

            const response = await fetch(
                `${API_ENDPOINTS.NYTIMES}/search/v2/articlesearch.json?${searchParams}`,
                { signal }
            );

            // Handle 429 Too Many Requests
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

            const data: NYTimesResponse = await response.json();
            rateLimiter.logRequest("nytimes");

            return data.response.docs.map((article) => ({
                articleId: article._id,
                title: article.headline.main,
                description: article.abstract,
                content: article.lead_paragraph,
                publishedAt: new Date(article.pub_date),
                source: "The New York Times",
                url: article.web_url,
                urlToImage: article.multimedia[0]?.url
                    ? `https://www.nytimes.com/${article.multimedia[0].url}`
                    : null,
                category: article.section_name,
            }));
        } catch (error: any) {
            if (error.name === "AbortError") {
                throw error; // Re-throw abort errors
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
                `${API_ENDPOINTS.NYTIMES}/news/v3/content/section-list.json?api-key=${API_KEYS.NYTIMES_API_KEY}`
            );

            if (!response.ok) {
                console.warn(
                    "Failed to fetch NY Times sections, using default sections"
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
            return data.results.map((section: any) => section.display_name);
        } catch (error) {
            console.error("Error fetching NY Times sections:", error);
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
