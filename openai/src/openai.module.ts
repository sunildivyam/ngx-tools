
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollapsibleModule } from '@annuadvent/ngx-common-ui/collapsible';
import { SpinnerModule } from '@annuadvent/ngx-common-ui/spinner';

import { OpenaiFormComponent } from './components/openai-form/openai-form.component';
import { OpenaiImageFormComponent } from './components/openai-image-form/openai-image-form.component';
import { ErrorModule } from '@annuadvent/ngx-common-ui/error';




@NgModule({
  declarations: [OpenaiFormComponent, OpenaiImageFormComponent],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    CollapsibleModule,
    SpinnerModule,
    ErrorModule,
  ],
  exports: [OpenaiFormComponent, OpenaiImageFormComponent],
})
export class OpenaiModule { }
