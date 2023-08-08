import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ImageFileInfo, ImageFileInfoList } from '../interfaces/fire-storage-image.interface';
import { FireStorageImageService } from './fire-storage-image.service';
import { FireAuthService } from '@annuadvent/ngx-tools/fire-auth';
import { PreviewOnImages } from '../interfaces/image-browser.interface';

@Injectable({
  providedIn: 'root'
})
export class ImageBrowserService {
  private imageFiles$ = new BehaviorSubject<Array<ImageFileInfo>>([]);
  private selected$ = new BehaviorSubject<ImageFileInfo>(null);
  private previewOnImages$ = new BehaviorSubject<PreviewOnImages>({});
  private _pageSize: number = 10;

  userId: string = '';
  nextPageToken: any = null;
  uploadValidationText: string;

  constructor(
    private fireStorageImageService: FireStorageImageService,
    private fireAuthService: FireAuthService,
    ) { 
    // If logged in user changed or loged off, then list should be cleared.
    this.fireAuthService.authStateChanged().subscribe((user: any) => {
      if(user?.id && user.id !== this.userId) {
        this.clear();
        this.userId = user.id;
      } else if(!user?.id) {
        this.clear();
        this.userId = null;
      }
    })
  }

  private clear(): void {
    this.imageFiles$.next([]);
    this.previewOnImages$.next({});
    this.selected$.next(null);
  }

  public get pageSize() : number {
    return this._pageSize;
  }
  
  public set pageSize(v : number) {
    this._pageSize = v;
  }
  
  public get imageFiles(): Observable<Array<ImageFileInfo>> {
    return this.imageFiles$.asObservable();
  }

  public get selected(): Observable<ImageFileInfo> {
    return this.selected$.asObservable();
  }

  public get previewOnImages(): Observable<PreviewOnImages> {
    return this.previewOnImages$.asObservable();
  }

  public async refreshList(): Promise<Array<ImageFileInfo>> {
    this.userId = this.fireAuthService.getCurrentUserId();
    if(!this.userId) {
      throw new Error('User is not authenticated or logged in.');
    }

    const imageFileInfoList: ImageFileInfoList = await this.fireStorageImageService.getImagesList(this.userId, this.pageSize, this.nextPageToken)
      .catch(err => {
        throw err;
      });

    this.nextPageToken = imageFileInfoList?.nextPageToken || null;
    this.uploadValidationText = this.fireStorageImageService.getUploadImageValidationText();
    this.previewOnImages$.next({});
    this.selected$.next(null);
    this.imageFiles$.next(imageFileInfoList?.imageFiles || []);

    return imageFileInfoList?.imageFiles || [];
  }

  public async loadMore(): Promise<Array<ImageFileInfo>> {
    this.userId = this.fireAuthService.getCurrentUserId();
    if(!this.userId) {
      throw new Error('User is not authenticated or logged in.');
    }
    const imageFileInfoList: ImageFileInfoList = await this.fireStorageImageService.getImagesList(this.userId, this.pageSize, this.nextPageToken)
      .catch(err => {
        throw err;
      });

    this.nextPageToken = imageFileInfoList?.nextPageToken || null;
    this.imageFiles$.next([
      ...this.imageFiles$.value,
      ...(imageFileInfoList?.imageFiles || [])
    ]);

    return imageFileInfoList?.imageFiles || [];
  }

  public async delete(imageFile: ImageFileInfo): Promise<ImageFileInfo> {  
    this.userId = this.fireAuthService.getCurrentUserId();
    if(!this.userId) {
      throw new Error('User is not authenticated or logged in.');
    }
      
    const deletedFileFullPath = await this.fireStorageImageService.deleteImage(imageFile?.name, this.userId)
      .catch(err => {
        throw err;
      });

    // Successful delete, remove it from the existing list too;

    this.imageFiles$.next(
      this.imageFiles$.value.filter(iFile => iFile.fullPath !== deletedFileFullPath)
    );

    return imageFile;
  }

  public async upload(imagePathWithFileName: string, imageData: any): Promise<ImageFileInfo> {
    this.userId = this.fireAuthService.getCurrentUserId();
    if(!this.userId) {
      throw new Error('User is not authenticated or logged in.');
    }

    const errorMessage = await this.fireStorageImageService.validateImage(imageData)
    .catch(err => err);
    if(errorMessage) {
      throw new Error(errorMessage);
    }

    const uploadedImageFile: ImageFileInfo = await this.fireStorageImageService.uploadImage(
      imagePathWithFileName,
      imageData,
      false,
      this.userId,
      false,
    )
      .catch(err => {
        throw err;
      });

    // Add uploaded file to 
    this.imageFiles$.next([
      uploadedImageFile,
      ...this.imageFiles$.value
    ]);

    return uploadedImageFile;
  }

  public selectImageFile(imageFile: ImageFileInfo): void {
    this.selected$.next(imageFile);
  }

  public previewImageFile(imageFullFileName: string, previewOn: boolean = true): void {
    this.previewOnImages$.next({
      ...this.previewOnImages$.value,
      [imageFullFileName]: previewOn
    });
  }

}
