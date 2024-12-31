// src/pages/ArticleDetailPage/ArticleDetailPage.tsx
import { useNavigate, useLoaderData } from "react-router-dom";
import Button from "../../components/common/Button";
import { Article } from "../../components/ArticlesSection/types";

const ArticleDetailPage = () => {
    const navigate = useNavigate();
    const article = useLoaderData() as Article;

    return (
        <article className="max-w-4xl mx-auto">
            <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="mb-6"
            >
                ← Back to Home
            </Button>

            {article.urlToImage && (
                <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-[400px] object-cover rounded-lg mb-6"
                />
            )}

            <div className="space-y-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{article.source}</span>
                    <span>•</span>
                    <time dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleDateString()}
                    </time>
                    {article.category && (
                        <>
                            <span>•</span>
                            <span>{article.category}</span>
                        </>
                    )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    {article.title}
                </h1>

                {article.author && (
                    <p className="text-gray-600 dark:text-gray-400">
                        By {article.author}
                    </p>
                )}

                <p className="text-lg text-gray-700 dark:text-gray-300">
                    {article.description}
                </p>

                <div
                    className="prose dark:prose-invert max-w-none dark:text-white"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Read full article on {article.source} →
                    </a>
                </div>
            </div>
        </article>
    );
};

export default ArticleDetailPage;
