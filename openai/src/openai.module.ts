
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollapsibleModule } from '@annuadvent/ngx-common-ui/collapsible';
import { SpinnerModule } from '@annuadvent/ngx-common-ui/spinner';

import { OpenaiFormComponent } from './components/openai-form/openai-form.component';
import { OpenaiImageFormComponent } from './components/openai-image-form/openai-image-form.component';
import { ErrorModule } from '@annuadvent/ngx-common-ui/error';
import { OpenaiConfigurationComponent } from './components/openai-configuration/openai-configuration.component';
import { ModalModule } from '@annuadvent/ngx-common-ui/modal';
import { CodeBlockModule } from '@annuadvent/ngx-common-ui/code-block';




@NgModule({
  declarations: [OpenaiFormComponent, OpenaiImageFormComponent, OpenaiConfigurationComponent],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    CollapsibleModule,
    SpinnerModule,
    ErrorModule,
    ModalModule,
    CodeBlockModule,
  ],
  exports: [OpenaiFormComponent, OpenaiImageFormComponent, OpenaiConfigurationComponent],
})
export class OpenaiModule { }
