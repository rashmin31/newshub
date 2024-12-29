import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { NewsSearchParams, UnifiedArticle } from "../../types/news";
import { Article } from "../../components/ArticlesSection/types";
import { aggregatorService } from "../../services/api/aggregatorService";
import { RateLimitError } from "../../services/rateLimiter";

interface CacheEntry {
    articles: Article[];
    timestamp: number;
    hasMore: boolean;
    rateLimitedApis: string[];
}

interface ArticlesState {
    items: Article[];
    isLoading: boolean;
    error: string | null;
    rateLimitedApis: string[];
    currentPage: number;
    hasMore: boolean;
    pageSize: number;
    cache: {
        [key: string]: CacheEntry;
    };
}

const initialState: ArticlesState = {
    items: [],
    isLoading: false,
    error: null,
    rateLimitedApis: [],
    currentPage: 1,
    hasMore: true,
    pageSize: 12,
    cache: {},
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Generate cache key from params
const generateCacheKey = (params: NewsSearchParams): string => {
    return JSON.stringify({
        query: params.query || "",
        category: params.category || "",
        source: params.source || "",
        fromDate: params.fromDate || "",
        toDate: params.toDate || "",
        page: params.page || 1,
        pageSize: params.pageSize || 12,
    });
};

// Check if cache is valid
const isCacheValid = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_DURATION;
};

// Cache cleanup helper
const performCacheCleanup = (cache: {
    [key: string]: CacheEntry;
}): { [key: string]: CacheEntry } => {
    const cleanedCache: { [key: string]: CacheEntry } = {};

    Object.entries(cache).forEach(([key, entry]) => {
        if (isCacheValid(entry.timestamp)) {
            cleanedCache[key] = entry;
        }
    });

    return cleanedCache;
};

export const fetchArticles = createAsyncThunk(
    "articles/fetchArticles",
    async (
        {
            params,
            signal,
            forceFetch = false,
        }: {
            params: NewsSearchParams;
            signal?: AbortSignal;
            forceFetch?: boolean;
        },
        { getState, rejectWithValue }
    ) => {
        const state = getState() as { articles: ArticlesState };
        const cacheKey = generateCacheKey(params);
        const cachedData = state.articles.cache[cacheKey];

        // Return cached data if valid and not forcing fetch
        if (!forceFetch && cachedData && isCacheValid(cachedData.timestamp)) {
            return {
                articles: cachedData.articles,
                hasMore: cachedData.hasMore,
                rateLimitedApis: cachedData.rateLimitedApis,
                fromCache: true,
            };
        }

        try {
            const response = await aggregatorService.fetchPaginatedArticles({
                ...params,
                page: params.page || 1,
                pageSize: params.pageSize || 12,
            });

            // Transform articles for consistent format
            const transformedArticles = response.articles.map(
                (article: UnifiedArticle) => ({
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
                })
            );

            return {
                articles: transformedArticles,
                hasMore: response.hasMore,
                rateLimitedApis: response.rateLimitedApis,
                fromCache: false,
            };
        } catch (err) {
            if (err instanceof RateLimitError) {
                return rejectWithValue(err.message);
            }
            if (err instanceof Error) {
                return rejectWithValue(err.message);
            }
            return rejectWithValue("An unexpected error occurred");
        }
    }
);

const articlesSlice = createSlice({
    name: "articles",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        clearArticles: (state) => {
            state.items = [];
            state.currentPage = 1;
            state.hasMore = true;
            state.error = null;
            state.rateLimitedApis = [];
        },
        clearCache: (state) => {
            state.cache = {};
        },
        cleanupCache: (state) => {
            state.cache = performCacheCleanup(state.cache);
        },
        invalidateCacheForFilter: (
            state,
            action: PayloadAction<Partial<NewsSearchParams>>
        ) => {
            const filterToInvalidate = action.payload;
            state.cache = Object.entries(state.cache).reduce(
                (acc, [key, value]) => {
                    const cacheParams = JSON.parse(key);
                    const shouldKeep = Object.entries(filterToInvalidate).every(
                        ([filterKey, filterValue]) =>
                            cacheParams[filterKey] !== filterValue
                    );
                    if (shouldKeep) {
                        acc[key] = value;
                    }
                    return acc;
                },
                {} as typeof state.cache
            );
        },
        updatePageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload;
            state.cache = {}; // Clear cache when page size changes
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchArticles.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.articles;
                state.hasMore = action.payload.hasMore;
                state.rateLimitedApis = action.payload.rateLimitedApis;
                state.error = null;

                // Only cache if data is not from cache
                if (!action.payload.fromCache) {
                    const params = action.meta.arg.params;
                    const cacheKey = generateCacheKey(params);
                    state.cache[cacheKey] = {
                        articles: action.payload.articles,
                        timestamp: Date.now(),
                        hasMore: action.payload.hasMore,
                        rateLimitedApis: action.payload.rateLimitedApis,
                    };
                }
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setPage,
    clearArticles,
    clearCache,
    cleanupCache,
    invalidateCacheForFilter,
    updatePageSize,
} = articlesSlice.actions;

export default articlesSlice.reducer;
