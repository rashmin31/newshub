import { RateLimiter } from "./RateLimiter";

export { RateLimiter, type ApiName } from "./RateLimiter";
export { RateLimitError } from "./RateLimitError";

// Create a singleton instance
export const rateLimiter = new RateLimiter();
