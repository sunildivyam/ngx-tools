import { TestBed } from '@angular/core/testing';

import { FireCategoriesHttpService } from './fire-categories-http.service';

describe('FireCategoriesHttpService', () => {
  let service: FireCategoriesHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireCategoriesHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
