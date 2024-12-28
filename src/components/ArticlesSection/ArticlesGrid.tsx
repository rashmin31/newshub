import ArticleCard from "./ArticleCard";
import { Article } from "./types";

interface ArticlesGridProps {
    articles: Article[];
}

const ArticlesGrid = ({ articles }: ArticlesGridProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {articles.map((article) => (
                <ArticleCard key={article.articleId} article={article} />
            ))}
        </div>
    );
};

export default ArticlesGrid;
