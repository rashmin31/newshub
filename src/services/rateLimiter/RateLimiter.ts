export type ApiName = "guardian" | "nytimes" | "newsapi";

interface RateLimits {
    [key: string]: {
        limit: number;
        resetTime: number; // in hours
    };
}

export class RateLimiter {
    private requests: { [key: string]: number[] } = {};
    private readonly limits: RateLimits = {
        guardian: { limit: 500, resetTime: 24 }, // 500 requests per day
        nytimes: { limit: 500, resetTime: 24 }, // 500 requests per day
        newsapi: { limit: 100, resetTime: 24 }, // 100 requests per day
    };

    constructor() {
        this.loadState();
        // Clean up old requests on initialization
        Object.keys(this.requests).forEach((apiName) => {
            this.cleanOldRequests(apiName as ApiName);
        });
        this.saveState();
    }

    private loadState(): void {
        const saved = localStorage.getItem("rateLimits");
        if (saved) {
            this.requests = JSON.parse(saved);
        }
    }

    private saveState(): void {
        localStorage.setItem("rateLimits", JSON.stringify(this.requests));
    }

    private cleanOldRequests(apiName: ApiName): void {
        const now = Date.now();
        const resetTime = this.limits[apiName].resetTime * 60 * 60 * 1000; // convert hours to ms

        if (!this.requests[apiName]) {
            this.requests[apiName] = [];
        }

        this.requests[apiName] = this.requests[apiName].filter(
            (time) => time > now - resetTime
        );
    }

    checkLimit(apiName: ApiName): boolean {
        this.cleanOldRequests(apiName);
        return this.requests[apiName].length < this.limits[apiName].limit;
    }

    logRequest(apiName: ApiName): void {
        this.cleanOldRequests(apiName);
        this.requests[apiName].push(Date.now());
        this.saveState();
    }

    getResetTime(apiName: ApiName): Date {
        if (this.requests[apiName]?.length > 0) {
            const oldestRequest = Math.min(...this.requests[apiName]);
            return new Date(
                oldestRequest + this.limits[apiName].resetTime * 60 * 60 * 1000
            );
        }
        return new Date();
    }

    // Method to clear all rate limit data (useful for testing or manual reset)
    clearAllLimits(): void {
        this.requests = {};
        this.saveState();
    }

    // Method to get rate limit status for all APIs
    getAllLimitsStatus(): {
        [key in ApiName]: { remaining: number; resetsAt: Date };
    } {
        const status = {} as {
            [key in ApiName]: { remaining: number; resetsAt: Date };
        };

        Object.keys(this.limits).forEach((apiName) => {
            const api = apiName as ApiName;
            status[api] = {
                remaining: this.getRemainingRequests(api),
                resetsAt: this.getResetTime(api),
            };
        });

        return status;
    }

    markRateLimited(apiName: ApiName): void {
        // Fill up to the limit to prevent further requests
        const limit = this.limits[apiName].limit;
        const now = Date.now();
        this.requests[apiName] = Array(limit).fill(now);
        this.saveState();
    }

    // Update getRemainingRequests to be more accurate
    getRemainingRequests(apiName: ApiName): number {
        this.cleanOldRequests(apiName);
        const used = this.requests[apiName].length;
        return Math.max(0, this.limits[apiName].limit - used);
    }
}
