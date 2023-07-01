import { Injectable } from '@angular/core';
import {
  StructuredQuery,
  StructuredQueryCollectionSelector,
  StructuredQueryCursor,
  StructuredQueryFieldFilter,
  StructuredQueryFieldReference,
  StructuredQueryFilter,
  StructuredQueryOrder,
  StructuredQuerySelectProjection,
  StructuredQueryType,
} from '../interfaces/structured-query.interface';
import {
  FireOrderField,
  FireQuery,
  FireQueryFilter,
} from '../interfaces/fire-query.interface';
import {
  StructuredQueryDirectionEnum,
  StructuredQueryOperatorEnum,
  StructuredQueryValueType,
} from '../enums/structured-query.enums';
import { LibConfig } from '@annuadvent/ngx-core/app-config';


@Injectable()
export class FirestoreQueryService {

  constructor(private libConfig: LibConfig) { }

  private getSelectFields(selectFields: Array<string>): StructuredQuerySelectProjection {
    return {
      fields: selectFields.map(field => ({ fieldPath: field }))
    } as StructuredQuerySelectProjection;
  }

  private getOrderBy(orderBy: Array<FireOrderField>): Array<StructuredQueryOrder> {
    return orderBy.map(orderByField => {
      let { fieldPath, isDesc } = orderByField;

      if (orderByField.fieldPath === 'id') {
        fieldPath = '__name__';
      }

      return {
        field: { fieldPath: fieldPath } as StructuredQueryFieldReference,
        direction: isDesc === true ? StructuredQueryDirectionEnum.DESCENDING : StructuredQueryDirectionEnum.ASCENDING
      } as StructuredQueryOrder
    });
  }

  private getStartPage(startPage: Array<any>, orderBy: Array<FireOrderField>): StructuredQueryCursor {
    const values = orderBy.map((orderField, index) => ({ [orderField.fieldType]: startPage[index] }))
    return {
      values,
      before: false
    } as StructuredQueryCursor;
  }

  private getWhere(where: Array<FireQueryFilter>, collectionId: string): StructuredQueryFilter {
    const filters = where.map(fireFilter => {
      let { fieldPath, operator, value, valueType } = fireFilter;

      /*
      * If Where has a filter for id, that means it has to be filtered on document's __name__ reference fieldpath.
      * Also __name__ has to be in orderBy. So add it to orderBy separately.
     */
      if (fieldPath === 'id') {
        const collectionUrl = this.libConfig.firestoreBaseApiUrl.substring(
          this.libConfig.firestoreBaseApiUrl.indexOf('/projects/') + 1
        );

        fieldPath = '__name__';
        value = value instanceof Array ?
          value.map(val => `${collectionUrl}/${collectionId}/${val}`) :
          `${collectionUrl}/${collectionId}/${value}`;
        valueType = StructuredQueryValueType.referenceValue;
      }

      return {
        fieldFilter: {
          field: { fieldPath: fieldPath },
          op: operator,
          value: value instanceof Array ?
            { arrayValue: { values: value.map(v => ({ [valueType]: v })) } } :
            { [valueType]: value },
        } as StructuredQueryFieldFilter
      }
    });

    return {
      compositeFilter: {
        filters,
        op: StructuredQueryOperatorEnum.AND
      }
    } as StructuredQueryFilter;
  }

  public fireToStructuredQuery(fireQuery: FireQuery): StructuredQuery {
    if (!fireQuery) throw new Error('Invalid Fire Query.');
    let { collectionId, selectFields, orderBy, where, isForwardDir, startPage, pageSize } = fireQuery;

    let squery: StructuredQueryType = {
      from: [{ collectionId, allDescendants: false } as StructuredQueryCollectionSelector]
    };

    /*
    * If id is in the where filters, then add id(__name__) to orderBy, its mandatory.
    */
    if (where && where.length && where.find(filter => filter.fieldPath === 'id')) {
      orderBy = orderBy ? [...orderBy] : [];
      // if not, id orderBy already exist, then add it to order By
      if (!orderBy.find(ord => ord.fieldPath === 'id')) {
        orderBy.push(
          {
            fieldPath: 'id',
            fieldType: StructuredQueryValueType.referenceValue,
            isDesc: true,
          } as FireOrderField
        )
      }
    }


    if (selectFields && selectFields.length) {
      squery.select = this.getSelectFields(selectFields);
    }

    if (orderBy && orderBy.length) {
      squery.orderBy = this.getOrderBy(orderBy);
    }

    if (startPage && orderBy && orderBy.length) {
      if (isForwardDir === false) {
        squery.endAt = this.getStartPage(startPage, orderBy);
      } else {
        squery.startAt = this.getStartPage(startPage, orderBy);
      }
    }

    if (pageSize > 0) {
      squery.limit = pageSize;
    }

    if (where && where.length) {
      squery.where = this.getWhere(where, collectionId);
    }

    return { structuredQuery: squery } as StructuredQuery;
  }

}
