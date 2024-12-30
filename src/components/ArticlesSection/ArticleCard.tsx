import { useState } from "react";
import { Article } from "./types";

const defaultPlaceholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%239ca3af' text-anchor='middle' alignment-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

interface ArticleCardProps {
    article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
    const [imgSrc, setImgSrc] = useState(
        article.urlToImage || defaultPlaceholder
    );
    const [hasError, setHasError] = useState(false);

    const handleImageError = () => {
        if (!hasError) {
            setImgSrc(defaultPlaceholder);
            setHasError(true);
        }
    };

    const handleArticleClick = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <article
            className="bg-white dark:bg-gray-800 rounded-lg 
                      shadow-sm hover:shadow-md dark:shadow-gray-700/50 
                      transition-shadow duration-200"
            onClick={() => handleArticleClick(article.url)}
        >
            <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                    src={imgSrc}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={handleImageError}
                />
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                    <span
                        className="inline-block px-2 py-1 text-xs sm:text-sm 
                                 text-white bg-blue-600 dark:bg-blue-500 rounded"
                    >
                        {article.source}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h2
                    className="text-lg sm:text-xl font-semibold 
                             text-gray-900 dark:text-white 
                             line-clamp-2 mb-2 hover:text-blue-500 dark:hover:text-blue-500"
                >
                    {article.title}
                </h2>
                <p
                    className="text-sm sm:text-base 
                             text-gray-600 dark:text-gray-300 
                             line-clamp-2 mb-4"
                >
                    {article.description}
                </p>
                <div
                    className="flex justify-between items-center 
                             text-xs sm:text-sm 
                             text-gray-500 dark:text-gray-400"
                >
                    <time dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleDateString()}
                    </time>
                    <span>{article.category}</span>
                </div>
                {article.author && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        By {article.author}
                    </div>
                )}
            </div>
        </article>
    );
};

export default ArticleCard;
