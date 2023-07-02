import { Injectable } from '@angular/core';
import { UtilsService } from '@annuadvent/ngx-core/utils';
import { Category } from '../interfaces/fire-categories.interface';

import {
  FireOrderField,
  FireQuery,
  FireQueryFilter,
  FirestoreHttpService,
  StructuredQueryOperatorEnum,
  StructuredQueryValueType,
} from '@annuadvent/ngx-tools/fire-store';
import {
  CATEGORIES_COLLECTION_ID,
  SHALLOW_CATEGORY_FIELDS,
  UPDATE_CATEGORY_FIELDS,
} from '../constants/fire-categories.constants';

import {
  PageCategories,
  PageCategoryGroup,
} from '../interfaces/fire-categories.interface';
import { FireArticlesHttpService } from './fire-articles-http.service';
import { FireCommonService } from '@annuadvent/ngx-tools/fire-common';

@Injectable()
export class FireCategoriesHttpService {
  firestoreApiUrl: string = '';

  constructor(
    private fireCommonService: FireCommonService,
    private utilsSvc: UtilsService,
    private firestoreHttpService: FirestoreHttpService,
    private fireArticlesHttpService: FireArticlesHttpService,
  ) {
    this.firestoreApiUrl = this.fireCommonService.firebaseConfig.store.firestoreBaseApiUrl;
  }

  private async buildPageOfCategories(
    categories: Array<Category>,
    pageSize: number = 0
  ): Promise<PageCategories> {
    const categoriesCount = categories?.length || 0;
    const pageCategories: PageCategories = {
      categories: categories || [],
      startPage: categoriesCount ? categories[0]?.updated : null,
      endPage:
        categoriesCount && pageSize && categoriesCount === pageSize
          ? categories[categoriesCount - 1]?.updated
          : null,
    };

    return pageCategories;
  }

  public async getCategory(categoryId: string): Promise<Category> {
    try {
      const category: Category = await this.firestoreHttpService.runQueryById(CATEGORIES_COLLECTION_ID, categoryId);
      return category;
    } catch (error: any) {
      throw error;
    }
  }

  public async getUsersCategory(
    userId: string,
    categoryId: string
  ): Promise<Category> {
    if (!userId) throw new Error('Please provide a valid user id.');
    if (!categoryId) throw new Error('Please Provide a valid category id.');

    const fireQuery: FireQuery = {
      collectionId: CATEGORIES_COLLECTION_ID,
      where: [
        {
          fieldPath: 'id',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: categoryId,
          valueType: StructuredQueryValueType.stringValue
        } as FireQueryFilter,
        {
          fieldPath: 'userId',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: userId,
          valueType: StructuredQueryValueType.stringValue
        } as FireQueryFilter
      ]
    };

    try {
      const categories = await this.firestoreHttpService.runQueryByConfig(fireQuery);
      const category = (categories?.length && categories[0]) || null;

      return category;
    } catch (error: any) {
      throw error;
    }
  }

  public async getAllLiveShallowCategories(
    isLive: boolean = true
  ): Promise<Array<Category>> {
    const fireQuery: FireQuery = {
      collectionId: CATEGORIES_COLLECTION_ID,
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
      selectFields: SHALLOW_CATEGORY_FIELDS,
    };

    try {
      const categories = await this.firestoreHttpService.runQueryByConfig(fireQuery);
      return categories;
    } catch (error: any) {
      throw error;
    }
  }

  public async getAllLiveCategoriesWithOnePageShallowArticles(
    pageSize: number = 0,
    startPage: string | null = null,
    isForwardDir: boolean = true
  ): Promise<Array<PageCategoryGroup>> {
    const fireQuery: FireQuery = {
      collectionId: CATEGORIES_COLLECTION_ID,
      where: [
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
      selectFields: SHALLOW_CATEGORY_FIELDS,
    };

    try {
      const categories = await this.firestoreHttpService.runQueryByConfig(fireQuery);
      return await this.fireArticlesHttpService.getLiveShallowArticlesOfCategories(
        categories,
        pageSize,
        startPage,
        isForwardDir
      );
    } catch (error: any) {
      throw error;
    }
  }

  public async getLiveCategoryWithOnePageShallowArticles(
    categoryId: string,
    pageSize: number = 0,
    startPage: string | null = null,
    isForwardDir: boolean = true
  ): Promise<PageCategoryGroup> {
    if (!categoryId) throw new Error('Please provide a valid category id.');

    const fireQuery: FireQuery = {
      collectionId: CATEGORIES_COLLECTION_ID,
      where: [
        {
          fieldPath: 'id',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: categoryId,
          valueType: StructuredQueryValueType.stringValue
        } as FireQueryFilter,
        {
          fieldPath: 'isLive',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: true,
          valueType: StructuredQueryValueType.booleanValue
        } as FireQueryFilter,
      ],
      selectFields: SHALLOW_CATEGORY_FIELDS,
    };

    try {
      const categories = await this.firestoreHttpService.runQueryByConfig(fireQuery);
      const category = (categories?.length && categories[0]) || null;
      if (category) {
        const pageCategoryGroups: Array<PageCategoryGroup> =
          await this.fireArticlesHttpService.getLiveShallowArticlesOfCategories(
            [category],
            pageSize,
            startPage,
            isForwardDir
          );
        return (pageCategoryGroups?.length && pageCategoryGroups[0]) || null;
      }

      return null;
    } catch (error: any) {
      throw error;
    }
  }

  public async getUsersOnePageShallowCategories(
    userId: string,
    isLive: boolean | null,
    pageSize: number = 0,
    startPage: string | null = null,
    isForwardDir: boolean = true
  ): Promise<PageCategories> {

    const fireQuery: FireQuery = {
      collectionId: CATEGORIES_COLLECTION_ID,
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
      selectFields: SHALLOW_CATEGORY_FIELDS,
    };

    try {
      const categories = await this.firestoreHttpService.runQueryByConfig(fireQuery);
      return await this.buildPageOfCategories(categories, pageSize);
    } catch (error: any) {
      throw error;
    }
  }

  public async getAllUsersOnePageShallowCategories(
    isLive: boolean | null,
    pageSize: number = 0,
    startPage: string | null = null,
    isForwardDir: boolean = true
  ): Promise<PageCategories> {

    const fireQuery: FireQuery = {
      collectionId: CATEGORIES_COLLECTION_ID,
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
      selectFields: SHALLOW_CATEGORY_FIELDS,
      pageSize,
      isForwardDir,
      startPage: startPage ? [startPage] : null
    };

    try {
      const categories = await this.firestoreHttpService.runQueryByConfig(fireQuery);
      return await this.buildPageOfCategories(categories, pageSize);
    } catch (error: any) {
      throw error;
    }
  }

  public async getShallowCategoriesByIds(
    categoryIds: Array<string>
  ): Promise<Array<Category>> {

    const fireQuery: FireQuery = {
      collectionId: CATEGORIES_COLLECTION_ID,
      where: [
        {
          fieldPath: 'id',
          operator: StructuredQueryOperatorEnum.IN,
          value: categoryIds,
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
      selectFields: SHALLOW_CATEGORY_FIELDS,
    };

    try {
      return await this.firestoreHttpService.runQueryByConfig(fireQuery);
    } catch (error: any) {
      throw error;
    }
  }

  public async getShallowLiveCategoriesByFeatures(
    features: string | Array<string>,
    isLive: boolean = true
  ): Promise<Array<Category>> {

    const fireQuery: FireQuery = {
      collectionId: CATEGORIES_COLLECTION_ID,
      where: [
        {
          fieldPath: 'isLive',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: isLive,
          valueType: StructuredQueryValueType.booleanValue
        } as FireQueryFilter,
        {
          fieldPath: 'features',
          operator: features instanceof Array ?
            StructuredQueryOperatorEnum.ARRAY_CONTAINS_ANY :
            StructuredQueryOperatorEnum.ARRAY_CONTAINS,
          value: features,
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
      selectFields: SHALLOW_CATEGORY_FIELDS,
    };


    try {
      return await this.firestoreHttpService.runQueryByConfig(fireQuery);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get all Live categories since the given last updated, by date.
   * @date 2/27/2023 - 6:40:21 PM
   *
   * @public
   * @async
   * @param {string} fromDateTime
   * @returns {Promise<Array<Category>>}
   */
  public async getAllLiveCategoriesFromDate(
    fromDateTime: string
  ): Promise<Array<Category>> {

    const fireQuery: FireQuery = {
      collectionId: CATEGORIES_COLLECTION_ID,
      where: [
        {
          fieldPath: 'isLive',
          operator: StructuredQueryOperatorEnum.EQUAL,
          value: true,
          valueType: StructuredQueryValueType.booleanValue
        } as FireQueryFilter,
        {
          fieldPath: 'updated',
          operator: StructuredQueryOperatorEnum.GREATER_THAN_OR_EQUAL,
          value: fromDateTime,
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
      selectFields: ['updated'],
    };

    try {
      const categories = await this.firestoreHttpService.runQueryByConfig(fireQuery);
      return categories;
    } catch (error: any) {
      throw error;
    }
  }

  public async addCategory(category: Category): Promise<Category> {
    const existedCategory = await this.getCategory(category.id).catch(
      (error: any) => {
        if (error.status === 404) {
          return null;
        } else {
          throw error;
        }
      }
    );
    if (existedCategory) throw new Error('Category already Exist.');

    return this.updateCategory(category)
      .catch((error) => {
        throw error;
      });
  }

  public async updateCategory(category: Category): Promise<Category> {
    const fieldsToUpdate = [...UPDATE_CATEGORY_FIELDS, 'isLive'];

    // Any modification to a category, will bring it to unpublished, and not up for review.
    const currentDate = this.utilsSvc.currentDate;
    const pCategory = { ...category, updated: currentDate, isLive: false, inReview: false };
    pCategory.metaInfo['article:published_time'] = currentDate;
    if (!pCategory.created) pCategory.created = currentDate;
    if (!pCategory.userId) throw new Error('Category userId is required.');

    return this.firestoreHttpService.runQueryToUpdate(CATEGORIES_COLLECTION_ID, pCategory, fieldsToUpdate, false)
      .catch((error) => {
        throw error;
      });
  }

  public async setCategoryUpForReview(category: Category): Promise<Category> {
    const fieldsToUpdate = ['inReview', 'isLive', 'updated', 'metaInfo'];

    // Any modification to a category, will bring it to unpublished, and not up for review.
    category.isLive = category.inReview === true ? false : category.isLive;

    return this.firestoreHttpService.runQueryToUpdate(CATEGORIES_COLLECTION_ID, category, fieldsToUpdate, false)
      .catch((error) => {
        throw error;
      });
  }

  public async setCategoryLive(category: Category): Promise<Category> {
    const fieldsToUpdate = ['inReview', 'isLive', 'updated', 'metaInfo'];

    // Any modification to a category, will bring it to unpublished, and not up for review.

    category.inReview = category.isLive === true ? false : category.inReview;

    return this.firestoreHttpService.runQueryToUpdate(CATEGORIES_COLLECTION_ID, category, fieldsToUpdate, false)
      .catch((error) => {
        throw error;
      });
  }

  public async deleteCategory(category: Category): Promise<boolean> {
    return this.firestoreHttpService.runQueryToDelete(CATEGORIES_COLLECTION_ID, category);
  }
}
