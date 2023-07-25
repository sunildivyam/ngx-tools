import { TestBed } from '@angular/core/testing';

import { FireArticlesHttpService } from './fire-articles-http.service';

describe('FireArticlesHttpService', () => {
  let service: FireArticlesHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireArticlesHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
