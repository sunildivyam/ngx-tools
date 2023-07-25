import { StructuredQueryValue } from "./structured-query.interface";

export interface FirebaseDocument {
    name?: string;
    fields?: {
        [key: string]: StructuredQueryValue
    },
    createTime?: string;
    updateTime?: string;
}
