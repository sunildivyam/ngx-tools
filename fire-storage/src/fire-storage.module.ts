
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from '@annuadvent/ngx-common-ui/card';
import { CollapsibleModule } from '@annuadvent/ngx-common-ui/collapsible';
import { CodeBlockModule } from '@annuadvent/ngx-common-ui/code-block';
import { ModalModule } from '@annuadvent/ngx-common-ui/modal';
import { SitemapComponent } from './components/sitemap/sitemap.component';



@NgModule({
  declarations: [SitemapComponent],
  providers: [],
  imports: [
    CommonModule,
    CardModule,
    CollapsibleModule,
    CodeBlockModule,
    ModalModule,
  ],
  exports: [SitemapComponent],
})
export class FireStorageModule { }
