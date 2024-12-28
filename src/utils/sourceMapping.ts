import { NewsCategories } from "../types/news";

export const sourceToApiKey = (source: string): keyof NewsCategories => {
    const mapping: { [key: string]: keyof NewsCategories } = {
        "The Guardian": "guardian",
        "The New York Times": "nytimes",
        NewsAPI: "newsapi",
    };

    return mapping[source] || "guardian"; // default to guardian if not found
};
