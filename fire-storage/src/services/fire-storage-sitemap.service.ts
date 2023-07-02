import { Injectable } from '@angular/core';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { FireCommonService } from '@annuadvent/ngx-tools/fire-common';
import { sitemapFileName } from '../constants/fire-storagee-sitemap.constants';

@Injectable()
export class FireStorageSitemapService {
  public sitemapFileName: string = sitemapFileName;

  constructor(private fireCommonService: FireCommonService) {

  }

  public async uploadSitemap(sitemapData: string): Promise<boolean> {
    const fireStorage = getStorage(
      this.fireCommonService.initOrGetFirebaseApp(),
      this.fireCommonService.firebaseConfig.app.storageBucket
    );
    const fileRef = ref(fireStorage, this.sitemapFileName);

    try {
      const uploadResult = await uploadString(fileRef, sitemapData);
      return true;
    } catch (error: any) {
      throw error;
    }
  }

  public async sitemapExists(): Promise<string> {
    const fireStorage = getStorage(
      this.fireCommonService.initOrGetFirebaseApp(),
      this.fireCommonService.firebaseConfig.app.storageBucket
    );
    const fileRef = ref(fireStorage, this.sitemapFileName);

    try {
      const url = await getDownloadURL(fileRef);

      return url;
    } catch (error: any) {
      if (error.code !== 'storage/object-not-found') {
        throw error;
      } else {
        return '';
      }
    }
  }

}
