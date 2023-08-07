import { Injectable } from '@angular/core';
import { Category } from '../interfaces/fire-categories.interface';
import { Article } from '../interfaces/fire-articles.interface';
import { PageCategoryGroup } from '../interfaces/fire-categories.interface';
import { PageArticles } from '../interfaces/fire-articles.interface';
import {
  ARTICLES_COLLECTION_ID,
  SHALLOW_ARTICLE_FIELDS,
  UPDATE_ARTICLE_FIELDS,
} from '../constants/fire-articles-http.contants';
import { UtilsService } from '@annuadvent/ngx-core/utils';
import { FireOrderField, FireQuery, FireQueryFilter, FirestoreHttpService, StructuredQueryOperatorEnum, StructuredQueryValueType } from '@annuadvent/ngx-tools/fire-store';


@Injectable({
  providedIn: 'root'
})
export class FireArticlesHttpService {

  constructor(
    private utilsSvc: UtilsService,
    private firestoreHttpService: FirestoreHttpService,
  ) { }

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

    return pageArticles;
  }

  public async getArticle(articleId: string): Promise<Article> {
    try {
      const article = await this.firestoreHttpService.runQueryById(ARTICLES_COLLECTION_ID, articleId);
      return article;
    } catch (error: any) {
      throw error;
    }
  }

  public async getLiveArticle(articleId: string): Promise<Article> {
    if (!articleId) throw new Error('Please provide a valid article id.');

    const fireQuery: FireQuery = {
      collectionId: ARTICLES_COLLECTION_ID,
      where: [
        {
          fieldPath: 'id',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: articleId,
          valueType: StructuredQueryValueType.stringValue
        } as FireQueryFilter,
        {
          fieldPath: 'isLive',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: true,
          valueType: StructuredQueryValueType.booleanValue
        } as FireQueryFilter,
      ],
    };

    try {
      const articles = await this.firestoreHttpService.runQueryByConfig(fireQuery);
      const article = articles?.length ? articles[0] : null;

      return article;
    } catch (error: any) {
      throw error;
    }
  }

  public async getUsersArticle(
    articleId: string,
    userId: string
  ): Promise<Article> {
    if (!articleId) throw new Error('Please provide a valid article id.');
    if (!userId) throw new Error('Please provide a valid article id.');

    const fireQuery: FireQuery = {
      collectionId: ARTICLES_COLLECTION_ID,
      where: [
        {
          fieldPath: 'id',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: articleId,
          valueType: StructuredQueryValueType.stringValue
        } as FireQueryFilter,
        {
          fieldPath: 'userId',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: userId,
          valueType: StructuredQueryValueType.stringValue
        } as FireQueryFilter,
      ],
    };

    try {
      const articles = await this.firestoreHttpService.runQueryByConfig(fireQuery);
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

    const fireQuery: FireQuery = {
      collectionId: ARTICLES_COLLECTION_ID,
      where: [
        {
          fieldPath: 'userId',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: userId,
          valueType: StructuredQueryValueType.stringValue
        } as FireQueryFilter,
        {
          fieldPath: 'isLive',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: isLive,
          valueType: StructuredQueryValueType.booleanValue
        } as FireQueryFilter,
      ],
      orderBy: [
        {
          fieldPath: 'updated',
          fieldType: StructuredQueryValueType.stringValue,
          isDesc: true
        } as FireOrderField
      ],
      selectFields: SHALLOW_ARTICLE_FIELDS,
      pageSize,
      isForwardDir,
      startPage: startPage ? [startPage] : null
    };

    try {
      const articles = await this.firestoreHttpService.runQueryByConfig(fireQuery);

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

    const fireQuery: FireQuery = {
      collectionId: ARTICLES_COLLECTION_ID,
      where: [
        {
          fieldPath: 'isLive',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: isLive,
          valueType: StructuredQueryValueType.booleanValue
        } as FireQueryFilter,
      ],
      orderBy: [
        {
          fieldPath: 'updated',
          fieldType: StructuredQueryValueType.stringValue,
          isDesc: true
        } as FireOrderField
      ],
      selectFields: SHALLOW_ARTICLE_FIELDS,
      pageSize,
      isForwardDir,
      startPage: startPage ? [startPage] : null
    };

    try {
      const articles = await this.firestoreHttpService.runQueryByConfig(fireQuery);

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

    const fireQuery: FireQuery = {
      collectionId: ARTICLES_COLLECTION_ID,
      where: [
        {
          fieldPath: 'userId',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: userId,
          valueType: StructuredQueryValueType.stringValue
        } as FireQueryFilter,
        {
          fieldPath: 'isLive',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: null,
          valueType: StructuredQueryValueType.booleanValue
        } as FireQueryFilter,
      ],
      orderBy: [
        {
          fieldPath: 'updated',
          fieldType: StructuredQueryValueType.stringValue,
          isDesc: true
        } as FireOrderField
      ],
      selectFields: SHALLOW_ARTICLE_FIELDS,
      pageSize,
      isForwardDir,
      startPage: startPage ? [startPage] : null
    };

    try {
      const articles = await this.firestoreHttpService.runQueryByConfig(fireQuery);

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

    const fireQuery: FireQuery = {
      collectionId: ARTICLES_COLLECTION_ID,
      where: [
        {
          fieldPath: 'isLive',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: null,
          valueType: StructuredQueryValueType.booleanValue
        } as FireQueryFilter,
      ],
      orderBy: [
        {
          fieldPath: 'updated',
          fieldType: StructuredQueryValueType.stringValue,
          isDesc: true
        } as FireOrderField
      ],
      selectFields: SHALLOW_ARTICLE_FIELDS,
      pageSize,
      isForwardDir,
      startPage: startPage ? [startPage] : null
    };

    try {
      const articles = await this.firestoreHttpService.runQueryByConfig(fireQuery);

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
      const fireQuery: FireQuery = {
        collectionId: ARTICLES_COLLECTION_ID,
        where: [
          {
            fieldPath: 'isLive',
            operator: StructuredQueryOperatorEnum.EQUAL,
            value: true,
            valueType: StructuredQueryValueType.booleanValue
          } as FireQueryFilter,
          {
            fieldPath: 'categories',
            operator: StructuredQueryOperatorEnum.ARRAY_CONTAINS,
            value: '',
            valueType: StructuredQueryValueType.stringValue
          } as FireQueryFilter,
        ],
        orderBy: [
          {
            fieldPath: 'updated',
            fieldType: StructuredQueryValueType.stringValue,
            isDesc: true
          } as FireOrderField
        ],
        selectFields: SHALLOW_ARTICLE_FIELDS,
        pageSize,
        isForwardDir,
        startPage: startPage ? [startPage] : null
      };

      try {
        pageCategoryGroups = await Promise.all(
          categories.map(async (cat) => {
            const catId = typeof cat === 'string' ? cat : cat.id;
            fireQuery.where.find(wh => wh.fieldPath === 'categories').value = catId;

            try {
              const catArticles = await this.firestoreHttpService.runQueryByConfig(fireQuery);
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

    const fireQuery: FireQuery = {
      collectionId: ARTICLES_COLLECTION_ID,
      where: [
        {
          fieldPath: 'updated',
          operator: StructuredQueryOperatorEnum.GREATER_THAN_OR_EQUAL,
          value: fromDateTime,
          valueType: StructuredQueryValueType.stringValue
        } as FireQueryFilter,
        {
          fieldPath: 'isLive',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: true,
          valueType: StructuredQueryValueType.booleanValue
        } as FireQueryFilter,
      ],
      orderBy: [
        {
          fieldPath: 'updated',
          fieldType: StructuredQueryValueType.stringValue,
          isDesc: true
        } as FireOrderField
      ],
      selectFields: ['categories', 'updated'],
    };

    try {
      const articles = await this.firestoreHttpService.runQueryByConfig(fireQuery);
      return articles;
    } catch (error: any) {
      throw error;
    }
  }

  public async getLiveOnePageShallowArticlesByFeatures(
    features: Array<string>,
    isLive: boolean = true,
    pageSize: number = 0,
    startPage: string | null = null,
    isForwardDir: boolean = true
  ): Promise<PageArticles> {

    const fireQuery: FireQuery = {
      collectionId: ARTICLES_COLLECTION_ID,
      where: [
        {
          fieldPath: 'features',
          operator: StructuredQueryOperatorEnum.ARRAY_CONTAINS_ANY,
          value: features,
          valueType: StructuredQueryValueType.stringValue
        } as FireQueryFilter,
        {
          fieldPath: 'isLive',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: isLive,
          valueType: StructuredQueryValueType.booleanValue
        } as FireQueryFilter,
      ],
      orderBy: [
        {
          fieldPath: 'updated',
          fieldType: StructuredQueryValueType.stringValue,
          isDesc: true
        } as FireOrderField
      ],
      selectFields: SHALLOW_ARTICLE_FIELDS,
      pageSize,
      isForwardDir,
      startPage: startPage ? [startPage] : null
    };

    try {
      const articles = await this.firestoreHttpService.runQueryByConfig(fireQuery);

      return await this.buildPageOfArticles(articles, pageSize);
    } catch (error: any) {
      throw error;
    }
  }

  public async addArticle(article: Article): Promise<Article> {
    const existedArticle = await this.getArticle(article.id).catch(
      (error: any) => {
        if (error.status === 404) {
          return null;
        } else {
          throw error;
        }
      }
    );
    if (existedArticle) throw new Error('Article already Exist.');
    return this.updateArticle(article).catch((error) => {
      throw error;
    });
  }

  public async updateArticle(article: Article): Promise<Article> {
    const fieldsToUpdate = [...UPDATE_ARTICLE_FIELDS, 'isLive'];

    const currentDate = this.utilsSvc.currentDate;
    const pArticle = { ...article, updated: currentDate, isLive: false, inReview: false } as Article;
    pArticle.metaInfo['article:published_time'] = currentDate;
    if (!pArticle.created) pArticle.created = currentDate;
    if (!pArticle.userId) throw new Error('Article userId is required.');


    return this.firestoreHttpService.runQueryToUpdate(ARTICLES_COLLECTION_ID, pArticle, fieldsToUpdate, false)
      .catch((error) => {
        throw error;
      });
  }

  public async setArticleUpForReview(article: Article): Promise<Article> {
    const fieldsToUpdate = ['inReview', 'isLive', 'updated', 'metaInfo'];

    // Any modification to a article, will bring it to unpublished, and not up for review.
    article.isLive = article.inReview === true ? false : article.isLive;
    const currentDate = this.utilsSvc.currentDate;
    article.updated = currentDate;
    article.metaInfo['article:published_time'] = currentDate;

    return this.firestoreHttpService.runQueryToUpdate(ARTICLES_COLLECTION_ID, article, fieldsToUpdate, false)
      .catch((error) => {
        throw error;
      });
  }

  public async setArticleLive(article: Article): Promise<Article> {
    const fieldsToUpdate = ['inReview', 'isLive', 'updated', 'metaInfo'];

    // Any modification to a article, will bring it to unpublished, and not up for review.
    article.inReview = article.isLive === true ? false : article.inReview;
    const currentDate = this.utilsSvc.currentDate;
    article.updated = currentDate;
    article.metaInfo['article:published_time'] = currentDate;

    return this.firestoreHttpService.runQueryToUpdate(ARTICLES_COLLECTION_ID, article, fieldsToUpdate, false)
      .catch((error) => {
        throw error;
      });
  }

  public async deleteArticle(article: Article): Promise<boolean> {
    return this.firestoreHttpService.runQueryToDelete(ARTICLES_COLLECTION_ID, article);
  }
}
