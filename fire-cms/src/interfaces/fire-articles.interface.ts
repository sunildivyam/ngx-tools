import { ImageInfo, MetaInfo } from "./fire-cms.interface";

export interface Article {
    id?: string; // dash separated article id, that can be used as router path.has to be unique, based on article title.
    metaInfo?: MetaInfo; // This info will be used for SEO for the page., title, description, keywords etc.
    image?: ImageInfo; // Thumbnail Image src
    body?: any;
    categories?: Array<string>;
    created?: string;
    updated?: string;
    userId?: string; // User Id from Users
    isLive?: boolean; // true if published and live to web.
    inReview?: boolean; // true if the article is up for review, if true, then isLive must be false
    features?: Array<string>;
}

export interface PageArticles {
    articles: Array<Article>;
    startPage?: any;            // startPage reference
    endPage?: any;              // endPage reference
    previousPage?: any;         // previous page reference if any
    nextPage?: any;             // next page reference if any
};
