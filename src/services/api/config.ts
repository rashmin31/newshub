export const API_KEYS = {
    GUARDIAN_API_KEY: import.meta.env.VITE_GUARDIAN_API_KEY,
    NYTIMES_API_KEY: import.meta.env.VITE_NYTIMES_API_KEY,
    NEWSAPI_API_KEY: import.meta.env.VITE_NEWSAPI_API_KEY,
};

export const API_ENDPOINTS = {
    GUARDIAN: "https://content.guardianapis.com",
    NYTIMES: "https://api.nytimes.com/svc/",
    NEWSAPI: "https://newsapi.org/v2",
};
