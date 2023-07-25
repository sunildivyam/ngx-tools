export class ImageFileInfo {
    name: string = '';
    fullPath: string = '';
    downloadUrl: string = '';

    constructor(imageFIle: any = null) {
        if (imageFIle) {
            this.name = imageFIle.name || '';
            this.fullPath = imageFIle.fullPath || '';
            this.downloadUrl = imageFIle.downloadUrl || '';
        }
    }
}

export interface ImageFileInfoList {
    imageFiles: Array<ImageFileInfo>;
    nextPageToken: string;
}
