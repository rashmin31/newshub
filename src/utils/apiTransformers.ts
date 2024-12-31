// src/utils/apiTransformers.ts
import {
    UnifiedArticle,
    GuardianArticle,
    NYTimesArticle,
    NewsAPIArticle,
} from "../types/news";

export const transformers = {
    guardianToUnified(article: GuardianArticle): UnifiedArticle {
        return {
            articleId: article.id,
            title: article.webTitle,
            description: article.fields?.trailText || "",
            content: article.fields?.body || "",
            publishedAt: new Date(article.webPublicationDate),
            source: "The Guardian",
            url: article.webUrl,
            urlToImage: article.fields?.thumbnail || null,
            category: article.sectionName,
        };
    },

    nyTimesToUnified(article: NYTimesArticle): UnifiedArticle {
        return {
            articleId: article._id,
            title: article.headline.main,
            description: article.abstract,
            content: article.lead_paragraph,
            publishedAt: new Date(article.pub_date),
            source: "The New York Times",
            url: article.web_url,
            urlToImage: article.multimedia[0]?.url
                ? `https://www.nytimes.com/${article.multimedia[0].url}`
                : null,
            category: article.section_name,
        };
    },

    newsApiToUnified(article: NewsAPIArticle): UnifiedArticle {
        return {
            articleId: `${article.source.name}-${article.publishedAt}`,
            title: article.title,
            description: article.description,
            content: article.content,
            publishedAt: new Date(article.publishedAt),
            source: article.source.name,
            url: article.url,
            urlToImage: article.urlToImage,
            category: "",
            author: article.author || undefined,
        };
    },
};
