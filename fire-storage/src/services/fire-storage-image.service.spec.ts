import { TestBed } from '@angular/core/testing';

import { FireStorageImageService } from './fire-storage-image.service';

describe('FireStorageImageService', () => {
  let service: FireStorageImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireStorageImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
