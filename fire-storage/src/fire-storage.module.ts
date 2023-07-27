
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from '@annuadvent/ngx-common-ui/card';
import { CollapsibleModule } from '@annuadvent/ngx-common-ui/collapsible';
import { CodeBlockModule } from '@annuadvent/ngx-common-ui/code-block';
import { ModalModule } from '@annuadvent/ngx-common-ui/modal';
import { SitemapComponent } from './components/sitemap/sitemap.component';
import { SpinnerModule } from '@annuadvent/ngx-common-ui/spinner';
import { ErrorModule } from '@annuadvent/ngx-common-ui/error';
import { SearchBoxModule } from '@annuadvent/ngx-common-ui/search-box';
import { ImageBrowserComponent } from './components/image-browser/image-browser.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SitemapComponent,
    ImageBrowserComponent,
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    CollapsibleModule,
    CodeBlockModule,
    ModalModule,
    SpinnerModule,
    ErrorModule,
    SearchBoxModule,
  ],
  exports: [
    SitemapComponent,
    ImageBrowserComponent,
  ],
})
export class FireStorageModule { }
