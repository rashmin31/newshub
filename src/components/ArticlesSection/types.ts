export interface Article {
    articleId: string; // changed from id
    title: string;
    description: string;
    content: string;
    publishedAt: string;
    source: string;
    url: string;
    urlToImage: string | null; // made nullable to match UnifiedArticle
    category: string;
    author?: string; // optional field from our UnifiedArticle
}

export interface NewsFilters {
    query?: string;
    category?: string;
    source?: string;
    fromDate?: string;
    toDate?: string;
}
