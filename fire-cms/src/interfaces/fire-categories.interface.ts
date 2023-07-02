
import { PageArticles } from './fire-articles.interface';
import { ImageInfo, MetaInfo } from './fire-cms.interface';

export interface Category {
    id?: string;
    shortTitle?: string;
    isFeatured?: boolean; // true, if featured category, this can be shown at primary locations on page.
    metaInfo?: MetaInfo; // This info will be used for SEO for the page., title, description, keywords etc.
    image?: ImageInfo; // Thumbnail Image src
    created?: string;
    updated?: string;
    userId?: string; // User Id from Users
    isLive?: boolean;
    inReview?: boolean; // if category is up for review, if this is true, then isLive must be false;
    features?: Array<string>; // any of the values from CategoryFeature, and any custom values.
}

export interface PageCategoryGroup {
    category: Category;
    pageArticles: PageArticles;
};

export interface PageCategories {
    categories: Array<Category>;
    startPage?: any;            // startPage reference
    endPage?: any;              // endPage reference
    previousPage?: any;         // previous page reference if any
    nextPage?: any;             // next page reference if any
};
