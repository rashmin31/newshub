jest.mock("../../src/services/api/config", () => ({
    API_KEYS: {
        GUARDIAN_API_KEY: "mock-guardian-key",
        NYTIMES_API_KEY: "mock-nytimes-key",
        NEWSAPI_API_KEY: "mock-newsapi-key",
    },
    API_ENDPOINTS: {
        GUARDIAN: "https://content.guardianapis.com",
        NYTIMES: "https://api.nytimes.com/svc/",
        NEWSAPI: "https://newsapi.org/v2",
    },
}));
import { configureStore } from "@reduxjs/toolkit";
import articlesReducer, {
    setPage,
    clearArticles,
    fetchArticles,
} from "../../src/store/slices/articlesSlice";
import { Article } from "../../src/components/ArticlesSection/types";

describe("Articles Slice", () => {
    let store: any;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                articles: articlesReducer,
            },
        });
    });

    it("handles setPage action", () => {
        store.dispatch(setPage(2));
        expect(store.getState().articles.currentPage).toBe(2);
    });

    it("handles clearArticles action", () => {
        // First set some data
        store.dispatch(setPage(2));

        // Then clear
        store.dispatch(clearArticles());

        expect(store.getState().articles).toEqual(
            expect.objectContaining({
                items: [],
                currentPage: 1,
                hasMore: true,
                error: null,
                rateLimitedApis: [],
            })
        );
    });

    it("handles fetchArticles.pending", () => {
        store.dispatch(fetchArticles.pending("", { params: {} }));
        expect(store.getState().articles.isLoading).toBe(true);
        expect(store.getState().articles.error).toBe(null);
    });

    it("handles fetchArticles.fulfilled", () => {
        const mockArticles: Article[] = [
            {
                articleId: "1",
                title: "Sample Title",
                description: "Sample Description",
                content: "Sample Content",
                publishedAt: "2024-01-01T00:00:00Z",
                source: "Sample Source",
                url: "https://sample.com",
                urlToImage: "https://sample.com/image.jpg",
                category: "Sample Category",
            },
        ];

        store.dispatch(
            fetchArticles.fulfilled(
                {
                    articles: mockArticles,
                    hasMore: true,
                    rateLimitedApis: [],
                    fromCache: false,
                },
                "",
                { params: {} }
            )
        );

        expect(store.getState().articles.items).toEqual(mockArticles);
        expect(store.getState().articles.isLoading).toBe(false);
        expect(store.getState().articles.hasMore).toBe(true);
    });
});
