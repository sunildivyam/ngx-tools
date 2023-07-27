import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OpenaiService } from '../../services/openai.service';
import { OpenaiImageSize } from '../../interfaces/openai.interface';
import { FireStorageImageService, ImageFileInfo } from '@annuadvent/ngx-tools/fire-storage';
import { FireAuthService } from '@annuadvent/ngx-tools/fire-auth';

@Component({
  selector: 'anu-openai-image-form',
  templateUrl: './openai-image-form.component.html',
  styleUrls: ['./openai-image-form.component.scss'],
})
export class OpenaiImageFormComponent {
  @Input() imagePromptText: string = '';
  @Input() imageFileName: string = '';
  @Output() imageGenerated = new EventEmitter<string>();
  @Output() fileUploaded = new EventEmitter<ImageFileInfo>();

  generatedBase64Image: string = '';
  savedImageUrl: string = '';
  loading: boolean = false;
  errorMsg: string = '';

  constructor(
    private openaiService: OpenaiService,
    private fireStorageImageService: FireStorageImageService,
    private fireAuthService: FireAuthService,
  ) { }

  public async generateImage(): Promise<string> {
    if (!this.imagePromptText.trim()) return '';
    this.startLoading();
    try {
      [this.generatedBase64Image] = await this.openaiService.getImagetResponse(
        this.imagePromptText,
        1,
        OpenaiImageSize._1024x1024
      );
      this.stopLoading();
      this.imageGenerated.emit(this.generatedBase64Image);
      return this.generatedBase64Image;
    } catch (err: any) {
      this.generatedBase64Image = '';
      this.stopLoading(err?.message);
      this.imageGenerated.emit('');
      return '';
    }
  }

  public async uploadImage(): Promise<void> {
    this.startLoading();
    if (!this.generatedBase64Image || !this.imageFileName) {
      this.stopLoading('Empty Image or not a valid file name');
      return;
    }
    

    const userId = this.fireAuthService.getCurrentUserId();
    if(!userId) {
      this.stopLoading('User is not authenticated or logged in.');
      return;
    }
    
    try {
      const imageFileInfo: ImageFileInfo =
        await this.fireStorageImageService.uploadImage(
          this.imageFileName,
          this.generatedBase64Image,
          true,
          userId,
          true
        );
        this.generatedBase64Image = '';
      this.savedImageUrl = `getImage?imageId=${imageFileInfo.fullPath}`;
      this.fileUploaded.emit(imageFileInfo);

      this.stopLoading();
      return;
    } catch (err) {
      this.stopLoading(err.message);
      return;
    }
  }

  private startLoading(): void {
    this.loading = true;
    this.errorMsg = '';
  }

  private stopLoading(err: string = ''): void {
    this.loading = false;
    this.errorMsg = err;
  }

}
