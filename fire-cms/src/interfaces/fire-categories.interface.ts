import { Category } from '@annuadvent/ngx-cms/category';
import { PageArticles } from './fire-articles.interface';

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
