import { TestBed } from '@angular/core/testing';

import { FireStorageSitemapService } from './fire-storage-sitemap.service';

describe('ImageFireStoreService', () => {
  let service: FireStorageSitemapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireStorageSitemapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
