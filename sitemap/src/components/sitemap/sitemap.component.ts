import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilsService } from '@annuadvent/ngx-core/utils';
import { Sitemap, SitemapInfo, SitemapItem } from '../../interfaces/sitemap.interface';
import { SitemapService } from '../../services/sitemap.service';

@Component({
  selector: 'anu-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent {
  @Input() sitemap: Sitemap | undefined;
  @Input() sitemapInfo: SitemapInfo | undefined;
  @Input() newUrls: Array<SitemapItem> = [];
  @Input() newSitemap: Sitemap | undefined;

  @Output() loadSitemapClicked = new EventEmitter<void>();
  @Output() saveClicked = new EventEmitter<Sitemap>();
  @Output() previewClicked = new EventEmitter<void>();
  @Output() checkNewUrlsClicked = new EventEmitter<void>();

  currentSitemapCollapsed: boolean = false;
  checkNewUrlsCollapsed: boolean = false;
  previewCollapsed: boolean = false;
  newUrlsStatus: object = {};
  sitemapXmlStr: string = '';
  showXmlModal: boolean = false;

  constructor(private utilsSvc: UtilsService, private sitemapService: SitemapService) { }

  public loadSitemap(event: any): void {
    event.preventDefault();
    this.currentSitemapCollapsed = true;
    this.loadSitemapClicked.emit();
  }

  public checkNewUrls(event: any): void {
    event.preventDefault();
    this.checkNewUrlsCollapsed = true;
    this.checkNewUrlsClicked.emit();
  }

  public previewSitemap(event: any): void {
    event.preventDefault();
    this.previewCollapsed = true;
    this.previewClicked.emit();
  }


  public saveSitemap(event: any): void {
    event.preventDefault();
    const clonedNewSitemap: Sitemap = this.utilsSvc.deepCopy(this.newSitemap);
    clonedNewSitemap.urlset.url.forEach(url => {
      delete url.status;
    })
    this.saveClicked.emit(clonedNewSitemap);
  }

  public showXmlString(event: any, sitemapJson: Sitemap): void {
    event.preventDefault();
    this.sitemapXmlStr = this.sitemapService.jsonToXmlSitemap(sitemapJson);
    this.showXmlModal = true;
  }

  public xmlModalClosed(): void {
    this.showXmlModal = false;
  }
}
