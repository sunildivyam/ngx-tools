
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollapsibleModule } from '@annuadvent/ngx-common-ui/collapsible';
import { SpinnerModule } from '@annuadvent/ngx-common-ui/spinner';

import { OpenaiService } from './services/openai.service';
import { OpenaiFormComponent } from './components/openai-form/openai-form.component';
import { OpenaiImageFormComponent } from './components/openai-image-form/openai-image-form.component';




@NgModule({
  declarations: [OpenaiFormComponent, OpenaiImageFormComponent],
  providers: [OpenaiService],
  imports: [
    CommonModule,
    FormsModule,
    CollapsibleModule,
    SpinnerModule,
  ],
  exports: [OpenaiFormComponent, OpenaiImageFormComponent],
})
export class OpenaiModule { }
