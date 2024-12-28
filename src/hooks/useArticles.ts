import { useState, useEffect, useRef } from "react";
import { Article } from "../components/ArticlesSection/types";
import { NewsFilters } from "../types/news";
import { aggregatorService } from "../services/api/aggregatorService";
import { RateLimitError } from "../services/rateLimiter";

interface ArticlesState {
    articles: Article[];
    isLoading: boolean;
    error: string | null;
    rateLimitedApis: string[];
}

export const useArticles = (
    filters: NewsFilters,
    page: number,
    pageSize: number
) => {
    const isFirstRender = useRef(true);
    const [state, setState] = useState<ArticlesState>({
        articles: [],
        isLoading: true,
        error: null,
        rateLimitedApis: [],
    });

    useEffect(() => {
        // Skip first automatic effect trigger
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const abortController = new AbortController();
        let isSubscribed = true;

        const fetchArticles = async () => {
            if (!isSubscribed) return;

            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            try {
                const result = await aggregatorService.fetchAllArticles(
                    {
                        ...filters,
                        page,
                        pageSize,
                    },
                    abortController.signal
                );

                if (!isSubscribed) return;

                const transformedArticles = result.articles.map((article) => ({
                    articleId: article.articleId,
                    title: article.title,
                    description: article.description,
                    content: article.content,
                    publishedAt: article.publishedAt.toISOString(),
                    source: article.source,
                    url: article.url,
                    urlToImage: article.urlToImage,
                    category: article.category,
                    author: article.author,
                }));

                setState({
                    articles: transformedArticles,
                    isLoading: false,
                    error: null,
                    rateLimitedApis: result.rateLimitedApis,
                });
            } catch (err) {
                if (!isSubscribed) return;
                if (err.name === "AbortError") {
                    return;
                }

                let errorMessage =
                    "Failed to fetch articles. Please try again later.";
                if (err instanceof RateLimitError) {
                    errorMessage = err.message;
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }

                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: errorMessage,
                }));
            }
        };

        fetchArticles();

        return () => {
            isSubscribed = false;
            abortController.abort();
        };
    }, [filters, page, pageSize]);

    return state;
};
