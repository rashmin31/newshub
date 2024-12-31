// src/routes/loaders.ts
import { LoaderFunctionArgs } from "react-router-dom";
import { store } from "../store";
import { fetchArticles } from "../store/slices/articlesSlice";

export const articleLoader = async ({ params }: LoaderFunctionArgs) => {
    try {
        if (!params.articleId) {
            throw new Response("Missing Article ID", { status: 400 });
        }

        // Decode the URL-encoded articleId
        const decodedArticleId = decodeURIComponent(params.articleId);

        // Check current state first
        const state = store.getState();
        const article = state.articles.items.find(
            (article) => article.articleId === decodedArticleId
        );

        if (article) {
            return article;
        }

        // If article not found in state, try to fetch it
        const response = await store
            .dispatch(
                fetchArticles({
                    params: {
                        query: "",
                        page: 1,
                        pageSize: 20, // Increased page size to improve chances of finding the article
                    },
                })
            )
            .unwrap();

        const fetchedArticle = response.articles.find(
            (article) => article.articleId === decodedArticleId
        );

        if (!fetchedArticle) {
            throw new Response("Article Not Found", {
                status: 404,
                statusText:
                    "Article not found. It might have been removed or is no longer available.",
            });
        }

        return fetchedArticle;
    } catch (error) {
        console.error("Error loading article:", error);
        throw new Response("Failed to load article", {
            status: 500,
            statusText: "Failed to load the article. Please try again later.",
        });
    }
};
