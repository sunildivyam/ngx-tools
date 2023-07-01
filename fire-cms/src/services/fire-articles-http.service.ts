import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Category } from '../../components/cms/category';
import { Article, ArticleFeatures } from '../../components/cms/article';
import { LibConfig } from '../../app-config';
import {
  FirestoreParserService,
  StructuredQueryValueType,
} from '../common-firebase';
import { QueryConfig } from '../firebase.interface';
import {
  ARTICLES_COLLECTIONS,
  RUN_QUERY_KEYWORD,
} from './articles-firebase.constants';
import { ArticlesFirebaseHttpQueryService } from './articles-firebase-http-query.service';
import { PageArticles, PageCategoryGroup } from './articles-firebase.interface';
import {
  SHALLOW_ARTICLE_FIELDS,
  UPDATE_ARTICLE_FIELDS,
} from './articles-firebase-http.contants';
import { UtilsService } from '../../services/utils/utils.service';
import { AuthFirebaseService } from '../auth/auth-firebase.service';

@Injectable({
  providedIn: 'root',
})
export class FireArticlesHttpService {
  firestoreApiUrl: string = '';

  constructor(
    private libConfig: LibConfig,
    private http: HttpClient,
    private firestoreParser: FirestoreParserService,
    private queryService: ArticlesFirebaseHttpQueryService,
    private utilsSvc: UtilsService,
    private fireAuthSvc: AuthFirebaseService
  ) {
    this.firestoreApiUrl = this.libConfig.firestoreBaseApiUrl;
  }

  private async buildPageOfArticles(
    articles: Array<Article>,
    pageSize: number = 0
  ): Promise<PageArticles> {
    const articlesCount = articles?.length || 0;
    const pageArticles: PageArticles = {
      articles: articles || [],
      startPage: articlesCount ? articles[0]?.updated : null,
      endPage:
        articlesCount && pageSize && articlesCount === pageSize
          ? articles[articlesCount - 1]?.updated
          : null,
    };

    // NOTE: Commenting this out as firebase does not have a good support for backward pagination. So will implement infinite cyclic pagination
    // if queryConfig is given, that means, previous and next page info will be fetched using this queryConfig.
    // if (articlesCount > 0 && pageSize > 0 && queryConfig) {
    //   //set previousPage
    //   if ((articlesCount === pageSize && startPage) || (articlesCount < pageSize && isForwardDir !== false && startPage)) {
    //     const query = { ...queryConfig, pageSize: 1, startPage: pageArticles.startPage, isForwardDir: false };
    //     const prevArticles = await this.runQueryByConfig(query);
    //     pageArticles.previousPage = prevArticles?.length > 0 ? prevArticles[0] : null;
    //   }

    //   //set nextPage
    //   if ((articlesCount === pageSize) || (articlesCount < pageSize && isForwardDir === false && startPage)) {
    //     const query = { ...queryConfig, pageSize: 1, startPage: pageArticles.endPage, isForwardDir: true };
    //     const nextArticles = await this.runQueryByConfig(query);
    //     pageArticles.nextPage = nextArticles?.length > 0 ? nextArticles[0] : null;
    //   }
    // }

    return pageArticles;
  }

  public async runQueryById(id: string): Promise<Article> {
    return new Promise((resolve, reject) => {
      if (!id) {
        reject('Please provide a valid article Id');
      } else {
        const url = `${this.firestoreApiUrl}/${ARTICLES_COLLECTIONS.ARTICLES}/${id}`;
        const httpSubscription = this.http.get(url).subscribe({
          next: (art: any) => {
            const article: Article = this.firestoreParser.parse(art) as Article;
            httpSubscription.unsubscribe();
            resolve(article);
          },
          error: reject,
        });
      }
    });
  }

  public async runQueryByConfig(
    queryConfig: QueryConfig
  ): Promise<Array<Article>> {
    return new Promise((resolve, reject) => {
      const url = `${this.firestoreApiUrl}${RUN_QUERY_KEYWORD}`;

      const httpSubscription = this.http
        .post(
          url,
          this.queryService.buildStructuredQuery(
            ARTICLES_COLLECTIONS.ARTICLES,
            queryConfig
          )
        )
        .subscribe({
          next: (arts: any) => {
            const articles: Array<Article> = this.firestoreParser.parse(
              arts
            ) as Array<Article>;
            httpSubscription.unsubscribe();
            resolve(articles);
          },
          error: (err) => reject({ config: queryConfig, error: err }),
        });
    });
  }

  public async runQueryToUpdate(
    article: Article,
    fieldsToUpdate: Array<string>,
    isBin: boolean = false
  ): Promise<Article> {
    if (!article || !article.id)
      throw new Error('Please provide a valid article.');
    const currentDate = this.utilsSvc.currentDate;
    const pArticle = { ...article, updated: currentDate } as Article;
    pArticle.metaInfo['article:published_time'] = currentDate;
    if (!pArticle.created) pArticle.created = currentDate;
    if (!pArticle.userId) pArticle.userId = this.fireAuthSvc.getCurrentUserId();
    delete pArticle.id;

    return new Promise((resolve, reject) => {
      const url = `${this.firestoreApiUrl}/${isBin === true
          ? ARTICLES_COLLECTIONS.ARTICLES_BIN
          : ARTICLES_COLLECTIONS.ARTICLES
        }/${article.id}`;
      const body = this.firestoreParser.buildFirebaseFields(
        pArticle,
        fieldsToUpdate
      );
      const params =
        this.firestoreParser.buildQueryParamsToUpdate(fieldsToUpdate);

      const httpSubscription = this.http
        .patch(url, body, { params })
        .subscribe({
          next: (art: any) => {
            const updatedArticle: Article = this.firestoreParser.parse(
              art
            ) as Article;
            httpSubscription.unsubscribe();
            resolve(updatedArticle);
          },
          error: reject,
        });
    });
  }

  public async runQueryToDelete(article: Article): Promise<boolean> {
    if (!article || !article.id)
      throw new Error('Please provide a valid article.');

    return new Promise((resolve, reject) => {
      // Copy to articles bin, then delete from articles db.
      this.runQueryToUpdate(article, null, true)
        .then(() => {
          const url = `${this.firestoreApiUrl}/${ARTICLES_COLLECTIONS.ARTICLES}/${article.id}`;
          // delete from articles db.
          const httpSubscription = this.http.delete(url).subscribe({
            next: (res: any) => {
              httpSubscription.unsubscribe();
              resolve(true);
            },
            error: reject,
          });
        })
        .catch(reject);
    });
  }

  public async getArticle(articleId: string): Promise<Article> {
    try {
      const article = await this.runQueryById(articleId);
      return article;
    } catch (error: any) {
      throw error;
    }
  }

  public async getLiveArticle(articleId: string): Promise<Article> {
    if (!articleId) throw new Error('Please provide a valid article id.');

    const articleQueryConfig: QueryConfig = {
      id: articleId,
      isLive: true,
    };
    try {
      const articles = await this.runQueryByConfig(articleQueryConfig);
      const article = articles?.length ? articles[0] : null;

      return article;
    } catch (error: any) {
      throw error as HttpErrorResponse;
    }
  }

  public async getUsersArticle(
    articleId: string,
    userId: string
  ): Promise<Article> {
    if (!articleId) throw new Error('Please provide a valid article id.');
    if (!userId) throw new Error('Please provide a valid article id.');

    const articleQueryConfig: QueryConfig = {
      id: articleId,
      userId,
    };

    try {
      const articles = await this.runQueryByConfig(articleQueryConfig);
      const article = articles?.length ? articles[0] : null;

      return article;
    } catch (error: any) {
      throw error;
    }
  }

  public async getUsersOnePageShallowArticles(
    userId: string,
    isLive: boolean | null,
    pageSize: number = 0,
    startPage: string | null = null,
    isForwardDir: boolean = true
  ): Promise<PageArticles> {
    const articlesQueryConfig: QueryConfig = {
      isLive,
      userId,
      orderField: 'updated',
      orderFieldType: StructuredQueryValueType.stringValue,
      startPage,
      pageSize,
      isForwardDir,
      isDesc: true,
      selectFields: SHALLOW_ARTICLE_FIELDS,
    };

    try {
      const articles = await this.runQueryByConfig(articlesQueryConfig);

      return await this.buildPageOfArticles(articles, pageSize);
    } catch (error: any) {
      throw error;
    }
  }

  public async getAllUsersOnePageShallowArticles(
    isLive: boolean | null,
    pageSize: number = 0,
    startPage: string | null = null,
    isForwardDir: boolean = true
  ): Promise<PageArticles> {
    const articlesQueryConfig: QueryConfig = {
      isLive,
      orderField: 'updated',
      orderFieldType: StructuredQueryValueType.stringValue,
      startPage,
      pageSize,
      isForwardDir,
      isDesc: true,
      selectFields: SHALLOW_ARTICLE_FIELDS,
    };

    try {
      const articles = await this.runQueryByConfig(articlesQueryConfig);

      return await this.buildPageOfArticles(articles, pageSize);
    } catch (error: any) {
      throw error;
    }
  }

  public async getUsersOnePageInReviewShallowArticles(
    userId: string,
    pageSize: number = 0,
    startPage: string | null = null,
    isForwardDir: boolean = true
  ): Promise<PageArticles> {
    const articlesQueryConfig: QueryConfig = {
      isLive: null, // null | false | true equals in review | offline | live
      userId,
      orderField: 'updated',
      orderFieldType: StructuredQueryValueType.stringValue,
      startPage,
      pageSize,
      isForwardDir,
      isDesc: true,
      selectFields: SHALLOW_ARTICLE_FIELDS,
    };

    try {
      const articles = await this.runQueryByConfig(articlesQueryConfig);

      return await this.buildPageOfArticles(articles, pageSize);
    } catch (error: any) {
      throw error;
    }
  }

  public async getAllUsersOnePageInReviewShallowArticles(
    pageSize: number = 0,
    startPage: string | null = null,
    isForwardDir: boolean = true
  ): Promise<PageArticles> {
    const articlesQueryConfig: QueryConfig = {
      isLive: null, // null | false | true equals in review | offline | live
      orderField: 'updated',
      orderFieldType: StructuredQueryValueType.stringValue,
      startPage,
      pageSize,
      isForwardDir,
      isDesc: true,
      selectFields: SHALLOW_ARTICLE_FIELDS,
    };
    try {
      const articles = await this.runQueryByConfig(articlesQueryConfig);

      return await this.buildPageOfArticles(articles, pageSize);
    } catch (error: any) {
      throw error;
    }
  }

  public async getLiveShallowArticlesOfCategories(
    categories: Array<string> | Array<Category>,
    pageSize: number = 0,
    startPage: string | null = null,
    isForwardDir: boolean = true
  ): Promise<Array<PageCategoryGroup>> {
    let pageCategoryGroups: Array<PageCategoryGroup> = [];

    if (categories && categories.length) {
      const catArticlesQueryConfig: QueryConfig = {
        isLive: true,
        orderField: 'updated',
        orderFieldType: StructuredQueryValueType.stringValue,
        articleCategoryId: '',
        startPage,
        pageSize,
        isForwardDir,
        isDesc: true,
        selectFields: SHALLOW_ARTICLE_FIELDS,
      };
      try {
        pageCategoryGroups = await Promise.all(
          categories.map(async (cat) => {
            try {
              const catArticles = await this.runQueryByConfig({
                ...catArticlesQueryConfig,
                articleCategoryId: typeof cat === 'string' ? cat : cat.id,
              });
              // if a single category, then add pagearticles with previous and next page info else leave that info empty., so that pagination can be enebled for Category articles.
              let pageArticles = await this.buildPageOfArticles(
                catArticles,
                pageSize
              );

              const pageCategoryGroup: PageCategoryGroup = {
                category:
                  typeof cat === 'string' ? ({ id: cat } as Category) : cat,
                pageArticles,
              };

              return pageCategoryGroup;
            } catch (error: any) {
              throw error;
            }
          })
        );
      } catch (error: any) {
        throw error;
      }
    }

    return pageCategoryGroups;
  }

  public async getAllLiveArticlesFromDate(
    fromDateTime: string
  ): Promise<Array<Article>> {
    const articlesQueryConfig: QueryConfig = {
      isLive: true,
      orderField: 'updated',
      updated: fromDateTime,
      orderFieldType: StructuredQueryValueType.stringValue,
      selectFields: ['categories', 'updated'],
    };
    try {
      const articles = await this.runQueryByConfig(articlesQueryConfig);
      return articles;
    } catch (error: any) {
      throw error;
    }
  }

  public async getLiveOnePageShallowArticlesByFeatures(
    features: Array<ArticleFeatures>,
    isLive: boolean = true,
    pageSize: number = 0,
    startPage: string | null = null,
    isForwardDir: boolean = true
  ): Promise<PageArticles> {
    const articlesQueryConfig: QueryConfig = {
      isLive,
      orderField: 'updated',
      orderFieldType: StructuredQueryValueType.stringValue,
      startPage,
      pageSize,
      isForwardDir,
      isDesc: true,
      features,
      selectFields: SHALLOW_ARTICLE_FIELDS,
    };
    try {
      const articles = await this.runQueryByConfig(articlesQueryConfig);

      return await this.buildPageOfArticles(articles, pageSize);
    } catch (error: any) {
      throw error;
    }
  }

  public async addArticle(article: Article): Promise<Article> {
    const fieldsToUpdate = [...UPDATE_ARTICLE_FIELDS, 'isLive'];
    // Any modification to a article, will bring it to unpublished, and not up for review.
    article.isLive = false;
    article.inReview = false;
    const existedArticle = await this.getArticle(article.id).catch(
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          return null;
        } else {
          throw error;
        }
      }
    );
    if (existedArticle) throw new Error('Article already Exist.');
    return this.runQueryToUpdate(article, fieldsToUpdate).catch((error) => {
      throw error;
    });
  }

  public async updateArticle(article: Article): Promise<Article> {
    const fieldsToUpdate = [...UPDATE_ARTICLE_FIELDS, 'isLive'];

    // Any modification to a article, will bring it to unpublished, and not up for review.
    article.isLive = false;
    article.inReview = false;

    return this.runQueryToUpdate(article, fieldsToUpdate).catch((error) => {
      throw error;
    });
  }

  public async setArticleUpForReview(article: Article): Promise<Article> {
    const fieldsToUpdate = ['inReview', 'isLive', 'updated', 'metaInfo'];

    // Any modification to a article, will bring it to unpublished, and not up for review.
    article.isLive = article.inReview === true ? false : article.isLive;

    return this.runQueryToUpdate(article, fieldsToUpdate).catch((error) => {
      throw error;
    });
  }

  public async setArticleLive(article: Article): Promise<Article> {
    const fieldsToUpdate = ['inReview', 'isLive', 'updated', 'metaInfo'];

    // Any modification to a article, will bring it to unpublished, and not up for review.
    article.inReview = article.isLive === true ? false : article.inReview;

    return this.runQueryToUpdate(article, fieldsToUpdate).catch((error) => {
      throw error;
    });
  }

  public async deleteArticle(article: Article): Promise<boolean> {
    return this.runQueryToDelete(article);
  }
}
