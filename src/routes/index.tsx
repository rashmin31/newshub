// src/routes/index.tsx
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import ArticleDetailPage from "../pages/ArticleDetailPage";
import ErrorPage from "../pages/ErrorPage";
import { articleLoader } from "./loaders";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Layout />} errorElement={<ErrorPage />}>
            <Route index element={<HomePage />} handle={{ crumb: "Home" }} />
            <Route
                path="article/:articleId"
                element={<ArticleDetailPage />}
                loader={articleLoader}
                handle={{ crumb: "Article" }}
            />
            <Route path="*" element={<ErrorPage />} />
        </Route>
    )
);
