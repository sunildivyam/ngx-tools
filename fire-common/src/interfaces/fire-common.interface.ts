export class FirebaseConfig {
    app: FireAppConfig;
    ui: any;
    store: FireStoreConfig;
    storage: FireStorageConfig;
}
export interface FireStorageImageSpecs {
    maxKBs: number;
    maxWidth: number;
    maxHeight: number;
    minWidth: number;
    minHeight: number;
};

export interface FireStorageConfig {
    baseStoreUrl: string;     // folder path inside bucket, ex. annu-business/articles
    fireStorageBaseApiUrl: string;  // API full base url
    imageDimensions: FireStorageImageSpecs;
};

export interface FireAppConfig {
    projectId: string;
    appId: string;
    storageBucket: string;
    locationId: string;
    apiKey: string;
    authDomain: string;
    messagingSenderId: string;
    measurementId: string;
}

export interface FireStoreConfig {
    firestoreBaseApiUrl: string;    // Firebase store db url, base api url
}
