import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    fetchArticles,
    setPage,
    clearArticles,
    cleanupCache,
} from "../../store/slices/articlesSlice";
import ArticlesGrid from "./ArticlesGrid";
import ArticleSkeleton from "./ArticleSkeleton";
import { NewsFilters } from "../../types/news";

interface ArticlesSectionProps {
    filters: NewsFilters;
}

const ArticlesSection = ({ filters }: ArticlesSectionProps) => {
    const dispatch = useAppDispatch();
    const {
        items: articles,
        isLoading,
        error,
        rateLimitedApis,
        currentPage,
        hasMore,
        pageSize,
    } = useAppSelector((state) => state.articles);

    // Periodic cache cleanup
    useEffect(() => {
        const cleanupInterval = setInterval(() => {
            dispatch(cleanupCache());
        }, 60000); // Run cleanup every minute

        return () => clearInterval(cleanupInterval);
    }, [dispatch]);

    // Fetch articles when filters or page changes
    useEffect(() => {
        dispatch(clearArticles());
        const controller = new AbortController();

        dispatch(
            fetchArticles({
                params: {
                    ...filters,
                    page: 1,
                    pageSize,
                },
                signal: controller.signal,
            })
        );

        return () => controller.abort();
    }, [dispatch, filters, pageSize]);

    const handleRetry = () => {
        dispatch(setPage(1));
        dispatch(
            fetchArticles({
                params: {
                    ...filters,
                    page: 1,
                    pageSize,
                },
            })
        );
    };

    const handlePageChange = (newPage: number) => {
        dispatch(setPage(newPage));
        dispatch(
            fetchArticles({
                params: {
                    ...filters,
                    page: newPage,
                    pageSize,
                },
            })
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section className="w-full">
            {rateLimitedApis.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200">
                        Some news sources are currently rate limited:{" "}
                        {rateLimitedApis.join(", ")}
                    </p>
                </div>
            )}

            {error ? (
                <div className="text-center py-8">
                    <p className="text-red-600 dark:text-red-400 mb-4">
                        {error}
                    </p>
                    <button
                        onClick={handleRetry}
                        className="px-4 py-2 bg-blue-600 text-white rounded 
                                 hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[...Array(pageSize)].map((_, index) => (
                        <ArticleSkeleton key={index} />
                    ))}
                </div>
            ) : articles.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                        No articles found. Try adjusting your filters.
                    </p>
                </div>
            ) : (
                <>
                    <ArticlesGrid articles={articles} />
                    <div className="mt-8 flex justify-center gap-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-blue-600 text-white rounded 
                                     hover:bg-blue-700 transition-colors
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="flex items-center text-gray-600 dark:text-gray-300">
                            Page {currentPage}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!hasMore}
                            className="px-4 py-2 bg-blue-600 text-white rounded 
                                     hover:bg-blue-700 transition-colors
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </section>
    );
};

export default ArticlesSection;
