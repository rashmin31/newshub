import { useState } from "react";
import ArticlesGrid from "./ArticlesGrid";
import ArticleSkeleton from "./ArticleSkeleton";
import { NewsFilters } from "../../types/news";
import { useArticles } from "../../hooks/useArticles";

interface ArticlesSectionProps {
    filters: NewsFilters;
}

const ArticlesSection = ({ filters }: ArticlesSectionProps) => {
    const [page, setPage] = useState(1);
    const pageSize = 12;

    const { articles, isLoading, error, rateLimitedApis } = useArticles(
        filters,
        page,
        pageSize
    );

    const handleRetry = () => {
        setPage(1);
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
                        No articles found.
                    </p>
                </div>
            ) : (
                <>
                    <ArticlesGrid articles={articles} />
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() =>
                                setPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={page === 1}
                            className="px-4 py-2 mr-2 bg-blue-600 text-white rounded 
                                     hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage((prev) => prev + 1)}
                            disabled={articles.length < pageSize}
                            className="px-4 py-2 bg-blue-600 text-white rounded 
                                     hover:bg-blue-700 transition-colors disabled:opacity-50"
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
