import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitemapComponent } from './components/sitemap/sitemap.component';
import { SitemapService } from './services/sitemap.service';
import { CardModule } from '@annuadvent/card';
import { CollapsibleModule } from '@annuadvent/collapsible';
import { ModalModule } from '@annuadvent/modal';
import { CodeBlockModule } from '@annuadvent/code-block';
import { FireSitemapStorage } from '@annuadvent/ngx-tools/fire-sitemap-storage';

@NgModule({
  declarations: [
    SitemapComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    CollapsibleModule,
    ModalModule,
    CodeBlockModule,
    FireSitemapStorage,
  ],
  providers: [
    SitemapService,
  ],
  exports: [
    SitemapComponent,
  ]
})
export class SitemapModule { }
