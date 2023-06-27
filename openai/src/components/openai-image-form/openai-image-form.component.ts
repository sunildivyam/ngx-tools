import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OpenaiService } from '../../services/openai.service';
import { OpenaiImageSize } from '../../interfaces/openai.interface';

@Component({
  selector: 'anu-openai-image-form',
  templateUrl: './openai-image-form.component.html',
  styleUrls: ['./openai-image-form.component.scss'],
})
export class OpenaiImageFormComponent {
  @Input() imagePromptText: string = '';
  @Input() imageFileName: string = '';
  @Output() imageGenerated = new EventEmitter<string>();

  generatedBase64Image: string = '';
  savedImageUrl: string = '';
  loading: boolean = false;
  errorMsg: string = '';

  constructor(
    private openaiService: OpenaiService,
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

  private startLoading(): void {
    this.loading = true;
    this.errorMsg = '';
  }

  private stopLoading(err: string = ''): void {
    this.loading = false;
    this.errorMsg = err;
  }

  public uploadImage() { }
}
