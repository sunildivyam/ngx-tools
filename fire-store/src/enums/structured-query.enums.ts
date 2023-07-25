export enum StructuredQueryDirectionEnum {
    DIRECTION_UNSPECIFIED = 'DIRECTION_UNSPECIFIED',
    ASCENDING = 'ASCENDING',
    DESCENDING = 'DESCENDING',
}

export enum StructuredQueryOperatorEnum {
    OPERATOR_UNSPECIFIED = 'OPERATOR_UNSPECIFIED',
    AND = 'AND',
    LESS_THAN = 'LESS_THAN',
    LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
    GREATER_THAN = 'GREATER_THAN',
    GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
    EQUAL = 'EQUAL',
    NOT_EQUAL = 'NOT_EQUAL',
    ARRAY_CONTAINS = 'ARRAY_CONTAINS',
    IN = 'IN',
    ARRAY_CONTAINS_ANY = 'ARRAY_CONTAINS_ANY',
    NOT_IN = 'NOT_IN',
    IS_NAN = 'IS_NAN',
    IS_NULL = 'IS_NULL',
    IS_NOT_NAN = 'IS_NOT_NAN',
    IS_NOT_NULL = 'IS_NOT_NULL',
}

export enum StructuredQueryValueType {
    nullValue = 'nullValue',
    booleanValue = 'booleanValue',
    integerValue = 'integerValue',
    doubleValue = 'doubleValue',
    timestampValue = 'timestampValue',
    stringValue = 'stringValue',
    bytesValue = 'bytesValue',
    referenceValue = 'referenceValue',
    geoPointValue = 'geoPointValue',
    arrayValue = 'arrayValue',
    mapValue = 'mapValue',
};
