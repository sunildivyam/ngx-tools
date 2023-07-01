import { Article } from '@annuadvent/ngx-cms/article';

export interface PageArticles {
    articles: Array<Article>;
    startPage?: any;            // startPage reference
    endPage?: any;              // endPage reference
    previousPage?: any;         // previous page reference if any
    nextPage?: any;             // next page reference if any
};
