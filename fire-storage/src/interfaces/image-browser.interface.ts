import { ImageBrowserLoaderEnum } from "../enums/image-browser.enums";

export interface PreviewOnImages {
    [key: string]: boolean;
};


export interface ImageBrowserLoadings {
    [ImageBrowserLoaderEnum.imageFile]?: {
        [key: string]: boolean;
    };
    [ImageBrowserLoaderEnum.imageFiles]?: boolean;
    [ImageBrowserLoaderEnum.uploadImageFile]?: boolean;
    [ImageBrowserLoaderEnum.loadMore]?: boolean;
};

