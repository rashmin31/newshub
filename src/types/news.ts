export interface NewsFilters {
    query: string;
    category: string;
    source: string;
    fromDate: string;
    toDate: string;
}

export interface UnifiedArticle {
    articleId: string;
    title: string;
    description: string;
    content: string;
    publishedAt: Date;
    source: string;
    url: string;
    urlToImage: string | null;
    category: string;
    author?: string;
}

export interface GuardianArticle {
    id: string;
    type: string;
    sectionId: string;
    sectionName: string;
    webPublicationDate: string;
    webTitle: string;
    webUrl: string;
    apiUrl: string;
    fields?: {
        headline: string;
        trailText: string;
        body: string;
        thumbnail: string;
    };
}

export interface NYTimesArticle {
    _id: string;
    abstract: string;
    web_url: string;
    snippet: string;
    lead_paragraph: string;
    print_section: string;
    print_page: string;
    source: string;
    multimedia: Array<{
        url: string;
        type: string;
    }>;
    headline: {
        main: string;
        kicker: string | null;
    };
    pub_date: string;
    section_name: string;
}

export interface NewsAPIArticle {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string;
}

// API Response Types
export interface GuardianResponse {
    response: {
        status: string;
        total: number;
        results: GuardianArticle[];
    };
}

export interface NYTimesResponse {
    status: string;
    copyright: string;
    response: {
        docs: NYTimesArticle[];
        meta: {
            hits: number;
            offset: number;
            time: number;
        };
    };
}

export interface NewsAPISuccessResponse {
    status: "ok";
    totalResults: number;
    articles: NewsAPIArticle[];
}

export interface NewsAPIErrorResponse {
    status: "error";
    code: string;
    message: string;
}

export type NewsAPIResponse = NewsAPISuccessResponse | NewsAPIErrorResponse;

// Search Parameters
export interface NewsSearchParams {
    query?: string;
    category?: string;
    source?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
}

export type NewsSource = "guardian" | "nytimes" | "newsapi";

export interface NewsCategories {
    [key: NewsSource]: string[]; // This won't work directly, let's fix it
}

export interface NewsCategories {
    guardian: string[];
    nytimes: string[];
    newsapi: string[];
}

export interface ApiMetadata {
    categories: NewsCategories;
    sources: string[];
}
