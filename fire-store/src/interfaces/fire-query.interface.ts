import { StructuredQueryOperatorEnum, StructuredQueryValueType } from "../enums/structured-query.enums";

export interface FireQueryFilter {
    fieldPath: string;
    operator: StructuredQueryOperatorEnum;
    value: any;
    valueType: StructuredQueryValueType;
};

export interface FireOrderField {
    fieldPath: string;
    fieldType: StructuredQueryValueType;
    isDesc: boolean;
};

export interface FireQuery {
    collectionId: string;
    selectFields: Array<string>;
    where?: Array<FireQueryFilter>;
    orderBy?: Array<FireOrderField>;
    isForwardDir?: boolean;
    startPage?: Array<number | string | undefined | null>;
    pageSize?: number;
}
