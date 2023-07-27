import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ImageBrowserService } from '../../services/image-browser.service';
import { ImageFileInfo } from '../../interfaces/fire-storage-image.interface';
import { ImageBrowserLoaderEnum } from '../../enums/image-browser.enums';
import { ImageBrowserLoadings, PreviewOnImages } from '../../interfaces/image-browser.interface';

const PAGE_SIZE = 30;

/**
 * Image Browser component allows logged in user to browse, select and upload images to fire store.
 * Image Browser is implemented upon Image Browser service (ImageBrowserService), that exposes observables 
 * to listen to any changes to the components data.
 * 
 * So It is recommended to use ImageBrowserService and its exposed observables to work with this component.
 */

@Component({
  selector: 'anu-image-browser',
  templateUrl: './image-browser.component.html',
  styleUrls: ['./image-browser.component.scss'],
})
export class ImageBrowserComponent implements OnInit {
  @ViewChild('fileInput') fileEl: ElementRef;
  @Input() imageFiles: Array<ImageFileInfo> = [];

  selectedImageFile: ImageFileInfo = null;
  previewOnImages: PreviewOnImages = {};

  imagesFilesFiltered: Array<ImageFileInfo> = [];  
  imagesFilesFilteredCount: number = 0;

  uploadHelpText: string = '';
  choosenFileName: string = '';
  choosenFile: any = null;
  nextPageToken: any = null;

  error: any;
  loading: ImageBrowserLoadings = {};
  deleteConfirmModalOpened: boolean = false;
  toDeleteImageFile: ImageFileInfo = null;


  constructor(private imageBrowserService: ImageBrowserService) { 
    this.imageBrowserService.pageSize = PAGE_SIZE;

    // Subscriptions
    this.imageBrowserService.imageFiles.subscribe((imageFiles => {
      this.imageFiles = imageFiles;
      this.nextPageToken = this.imageBrowserService.nextPageToken;
      this.uploadHelpText = this.imageBrowserService.uploadValidationText;
    }));

    this.imageBrowserService.selected.subscribe((imageFile => {
      this.selectedImageFile = imageFile;
    }));

    this.imageBrowserService.previewOnImages.subscribe((previewOnImages => {
      this.previewOnImages = previewOnImages;
    }));
  }

  ngOnInit(): void {    
  }

  private setErrorAndLoading(loaderName: ImageBrowserLoaderEnum, err: any = null, loading: boolean = true, subLoaderName: string = ''): void {
    if(err) {
      this.error = {code: err.code || err.status || 'UNKNOWN', message: err.message || err.text || err.toString()};
    } else {
      this.error = null;
    }
    if(subLoaderName) {
      this.loading.imageFile = this.loading.imageFile || {};
      this.loading.imageFile[subLoaderName] = loading;
    } else {
      switch(loaderName) {
        case ImageBrowserLoaderEnum.imageFiles:
          this.loading.imageFiles = loading;
          break;
        case ImageBrowserLoaderEnum.loadMore:
          this.loading.loadMore = loading;
          break;
        case ImageBrowserLoaderEnum.uploadImageFile:
          this.loading.uploadImageFile = loading;
          break; 
      }      
    }    
  }
  
  public onImageListFilter(imageFilesFiltered: Array<object>): void {
    this.imagesFilesFiltered = imageFilesFiltered as Array<ImageFileInfo>;
    
    setTimeout(() => {
      this.imagesFilesFilteredCount = this.imagesFilesFiltered?.length || 0;
    })
  }

  public refreshClick(event: any) {
    event.preventDefault();
    this.setErrorAndLoading(ImageBrowserLoaderEnum.imageFiles);
    this.imageBrowserService.refreshList()
    .then(() => {
      this.setErrorAndLoading(ImageBrowserLoaderEnum.imageFiles, null, false);
    },
    (err) => {
      this.setErrorAndLoading(ImageBrowserLoaderEnum.imageFiles, err, false);
    });    
  }

  public selectClick(event: any, imageFile: ImageFileInfo): void {
    event.preventDefault();
    this.imageBrowserService.selectImageFile(imageFile);
  }

  public loadMoreClick(event: any) {
    event.preventDefault();
    this.setErrorAndLoading(ImageBrowserLoaderEnum.loadMore);
    this.imageBrowserService.loadMore()
    .then(() => {
      this.setErrorAndLoading(ImageBrowserLoaderEnum.loadMore, null, false);
    },
    (err) => {
      this.setErrorAndLoading(ImageBrowserLoaderEnum.loadMore, err, false);
    }); 
  }

  public deleteImageOkClick(): void {
    this.deleteConfirmModalOpened = false;

    this.setErrorAndLoading(ImageBrowserLoaderEnum.imageFile, null, true, this.toDeleteImageFile.fullPath);
    this.imageBrowserService.delete(this.toDeleteImageFile)
    .then(() => {
      this.setErrorAndLoading(ImageBrowserLoaderEnum.imageFile, null, false, this.toDeleteImageFile.fullPath);
      this.toDeleteImageFile = null;
    },
    (err) => {
      this.setErrorAndLoading(ImageBrowserLoaderEnum.imageFile, err, false, this.toDeleteImageFile.fullPath);
      this.toDeleteImageFile = null;
    }); 
  }

  public deleteImageCancelClick(): void {
    this.deleteConfirmModalOpened = false;
    this.toDeleteImageFile = null;
  }

  public deleteClick(event: any, imageFile: ImageFileInfo): void {
    event.preventDefault();
    this.deleteConfirmModalOpened = true;
    this.toDeleteImageFile = imageFile;
  }

  public previewClick(event: any, imageFile: ImageFileInfo): void {
    event.preventDefault();
    this.imageBrowserService.previewImageFile(imageFile.fullPath)
  }

  public onFileChange(event: any) {
    this.choosenFileName = '';
    if (event.target.files.length > 0) {
      this.choosenFile = event.target.files[0];
      this.choosenFileName = this.choosenFile.name;            
    }
  }

  public uploadClick(): void {
    const fileInputEl = this.fileEl.nativeElement;
    fileInputEl.value = '';
    this.choosenFileName = '';
    fileInputEl.click();
  }

  public uploadFileClick(event: any): void {
    event.preventDefault();
    if(!this.choosenFileName || !this.choosenFile) return;

    this.setErrorAndLoading(ImageBrowserLoaderEnum.uploadImageFile);    
      this.imageBrowserService.upload( this.choosenFileName || this.choosenFile.name, this.choosenFile)
      .then((imageFile: ImageFileInfo) => {
        this.imageBrowserService.selectImageFile(imageFile);
        this.setErrorAndLoading(ImageBrowserLoaderEnum.uploadImageFile, null, false);
      },
      (err) => {
        this.setErrorAndLoading(ImageBrowserLoaderEnum.uploadImageFile, err, false);
      }); 
  }
}
