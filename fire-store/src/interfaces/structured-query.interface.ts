import { StructuredQueryDirectionEnum, StructuredQueryOperatorEnum } from '../enums/structured-query.enums';

// StructuredQuery Interfaces for firestore

export interface StructuredQueryLatLng {
    latitude: number;
    longitude: number;
}

export interface StructuredQueryArrayValue {
    values: Array<StructuredQueryValue>;
}

export interface StructuredQueryMapValue {
    fields: {
        [key: string]: StructuredQueryValue
    };
}

export interface StructuredQueryValue {
    nullValue?: null;
    booleanValue?: boolean;
    integerValue?: number;
    doubleValue?: number;
    timestampValue?: string;
    stringValue?: string;
    bytesValue?: string;
    referenceValue?: string;
    geoPointValue?: StructuredQueryLatLng;
    arrayValue?: StructuredQueryArrayValue;
    mapValue?: StructuredQueryMapValue;
};

export interface StructuredQueryCollectionSelector {
    collectionId: string;
    allDescendants?: boolean;
}

export interface StructuredQueryFieldReference {
    fieldPath: string;
}

export interface StructuredQuerySelectProjection {
    fields: Array<StructuredQueryFieldReference>
}

export interface StructuredQueryCompositeFilter {
    op: StructuredQueryOperatorEnum;
    filters: Array<StructuredQueryFilter>;
}

export interface StructuredQueryFieldFilter {
    field: StructuredQueryFieldReference;
    op: StructuredQueryOperatorEnum;
    value: StructuredQueryValue;
}

export interface StructuredQueryUnaryFilter {
    op: StructuredQueryOperatorEnum;
    field: StructuredQueryFieldReference;
}

export interface StructuredQueryFilter {
    compositeFilter?: StructuredQueryCompositeFilter;
    fieldFilter?: StructuredQueryFieldFilter;
    unaryFilter?: StructuredQueryUnaryFilter;
}

export interface StructuredQueryOrder {
    field: StructuredQueryFieldReference;
    direction: StructuredQueryDirectionEnum;
}

export interface StructuredQueryCursor {
    values: Array<StructuredQueryValue>;
    before: boolean;
}


export interface StructuredQueryType {
    select?: StructuredQuerySelectProjection,
    from: Array<StructuredQueryCollectionSelector>,
    where?: StructuredQueryFilter,
    orderBy?: Array<StructuredQueryOrder>,
    startAt?: StructuredQueryCursor,
    endAt?: StructuredQueryCursor,
    offset?: number,
    limit?: number,
    limitToLast?: number
}

export interface StructuredQuery {
    structuredQuery: StructuredQueryType
}
