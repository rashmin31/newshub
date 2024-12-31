import { rateLimiter, RateLimitError } from "../rateLimiter";
import { NewsSource } from "../../types/news";

export async function handleApiRequest<T>(
    source: NewsSource,
    requestFn: () => Promise<T>,
    signal?: AbortSignal
): Promise<T> {
    // Check rate limit before making request
    if (!rateLimiter.checkLimit(source)) {
        const resetTime = rateLimiter.getResetTime(source);
        throw new RateLimitError(
            `${source} API rate limit exceeded. Resets at ${resetTime.toLocaleString()}`
        );
    }

    try {
        const response = await requestFn();
        rateLimiter.logRequest(source);
        return response;
    } catch (error: any) {
        if (error.name === "AbortError") {
            throw error;
        }

        // Handle rate limit responses
        if (error.status === 429 || error instanceof RateLimitError) {
            rateLimiter.markRateLimited(source);
            const resetTime = error.headers?.get("x-ratelimit-reset");
            const resetDate = resetTime
                ? new Date(parseInt(resetTime) * 1000)
                : rateLimiter.getResetTime(source);

            throw new RateLimitError(
                `${source} API rate limit exceeded. Resets at ${resetDate.toLocaleString()}`
            );
        }

        console.error(`Error fetching from ${source} API:`, error);
        throw error;
    }
}

export function createApiErrorMessage(source: string, status: number): string {
    return `${source} API responded with status: ${status}`;
}
