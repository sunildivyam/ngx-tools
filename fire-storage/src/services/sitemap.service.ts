import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import {
  Sitemap,
  SitemapInfo,
  SitemapItem,
  SitemapResponse,
} from '../interfaces/fire-storage-sitemap.interface';
import { Buffer } from 'buffer';
import { xml2json, json2xml } from 'xml-js';
import { UtilsService } from '@annuadvent/ngx-core/utils';
import { AppConfigService } from '@annuadvent/ngx-core/app-config';
import { FireStorageSitemapService } from './fire-storage-sitemap.service';
import { defaultSitemapXmlStr } from '../constants/fire-storagee-sitemap.constants';


@Injectable()
export class SitemapService {

  constructor(
    private appConfigService: AppConfigService,
    private utilsSvc: UtilsService,
    private httpClient: HttpClient,
    private sitemapFireSvc: FireStorageSitemapService) {
    if (typeof window !== undefined) {
      (window as any).Buffer = (window as any).Buffer || Buffer;
    }
  }

  /**
   * Reads the sitemap.xml
   * @date 2/21/2023 - 11:35:49 PM
   *
   * @public
   * @async
   * @returns {Promise<SitemapResponse>}
   */
  public async getSitemapResponse(): Promise<SitemapResponse> {
    const sitemapDownloadUrl = await this.sitemapFireSvc.sitemapExists();
    let sitemapStr: string = '';
    if (sitemapDownloadUrl) {
      const xmlResponseObserver$ = this.httpClient.get<string>(sitemapDownloadUrl, {
        observe: 'body',
        responseType: 'text' as 'json'  // hack to avoid type error
      });
      return new Promise((resolve, reject) => {
        xmlResponseObserver$.pipe(catchError((error: any) => {
          reject(error);

          return throwError(() => {
            return error;
          });
        }))
          .subscribe((sitemapStr: string) => {
            resolve(this.prepareSitemapResponse(sitemapStr));
          });
      });
    } else {
      sitemapStr = defaultSitemapXmlStr;
      return this.prepareSitemapResponse(sitemapStr);
    }
  }

  /**
   * Saves both sitemap.xml to firebase storage
   * @date 2/28/2023 - 11:13:44 PM
   *
   * @public
   * @async
   * @param {Sitemap} sitemapJson
   * @returns {Promise<boolean>}
   */
  public async saveSitemap(sitemapJson: Sitemap): Promise<boolean> {
    const xmlStr = this.jsonToXmlSitemap(sitemapJson);
    const result = await this.sitemapFireSvc.uploadSitemap(xmlStr);
    return result;
  }

  /**
   * Appends Urls to existing sitemap json.
   * @date 2/22/2023 - 1:35:03 AM
   *
   * @public
   * @param {Array<SitemapItem>} urls
   * @param {Sitemap} sitemap
   * @returns {Sitemap}
   */
  public addUrlsToSitemapJson(urls: Array<SitemapItem>, sitemap: Sitemap): Sitemap {
    const newSitemap: Sitemap = this.utilsSvc.deepCopy(sitemap);

    if (!urls || !urls.length) {
      return newSitemap;
    }

    const clonedUrls: Array<SitemapItem> = urls.map(url => this.utilsSvc.deepCopy(url));

    clonedUrls.forEach(url => {
      // check if url exist in sitemap
      const index = newSitemap.urlset.url.findIndex(u => u.loc._text === url.loc._text);
      if (index >= 0) {
        url.status = false;
        newSitemap.urlset.url.splice(index, 1);
      } else {
        url.status = true;
      }
    });

    newSitemap.urlset.url = [].concat(newSitemap.urlset.url, clonedUrls);

    return newSitemap;
  }


  /**
   * Converts json sitemap to xml sitemap string.
   * @date 2/22/2023 - 1:37:41 AM
   *
   * @public
   * @param {Sitemap} sitemap
   * @returns {string}
   */
  public jsonToXmlSitemap(sitemap: Sitemap): string {
    const sitemapStr = JSON.stringify(sitemap);
    const sitemapXmlStr = json2xml(sitemapStr, { compact: true, spaces: 4 });

    return sitemapXmlStr;
  }

  /**
   * Converts xml sitemap to json sitemap.
   * @date 2/22/2023 - 1:37:41 AM
   *
   * @public
   * @param {xmlStr} string
   * @returns {Sitemap}
   */
  public xmlToJsonSitemap(xmlStr: string = ''): Sitemap {
    //Unescaping \" to " so as to parse xml.
    const newStr = xmlStr.replaceAll('\\"', '"');
    const jsonStr = xml2json(newStr, { compact: true });
    const sitemap = JSON.parse(jsonStr);

    return sitemap;
  }

  public getLastUpdatedFromSitemap(sitemap: Sitemap): string {
    const urls = sitemap?.urlset?.url || [];
    let lastUpdated: string = '';
    if (!urls.length) {
      return (new Date('1979-01-01')).toISOString();
    }

    lastUpdated = urls[0].lastmod._text;
    urls.forEach(url => {
      if ((new Date(url.lastmod._text)) > (new Date(lastUpdated))) {
        lastUpdated = url.lastmod._text;
      }
    });
    return lastUpdated;
  }

  private prepareSitemapResponse(sitemapStr: string): SitemapResponse {
    const sitemap = this.xmlToJsonSitemap(sitemapStr);

    const sitemapInfo: SitemapInfo = {
      updated: this.getLastUpdatedFromSitemap(sitemap)
    };

    // check if no urls in xml then add root and login urls.
    if (!sitemap.urlset?.url?.length) {
      sitemap.urlset.url = [
        {
          loc: {
            _text: `${this.appConfigService.config.apiBaseUrl}`
          },
          lastmod: {
            _text: this.utilsSvc.currentDate
          },
          priority: {
            _text: '1.00'
          }
        } as SitemapItem,
        {
          loc: {
            _text: `${this.appConfigService.config.apiBaseUrl}/login`
          },
          lastmod: {
            _text: this.utilsSvc.currentDate
          },
          priority: {
            _text: '1.00'
          }
        } as SitemapItem
      ];
    }

    const sitemapResponse: SitemapResponse = {
      sitemapInfo,
      sitemap
    };

    return sitemapResponse;
  }
}
