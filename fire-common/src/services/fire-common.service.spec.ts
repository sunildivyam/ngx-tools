import { TestBed } from '@angular/core/testing';

import { FireCommonService } from './fire-common.service';

describe('FireCommonService', () => {
  let service: FireCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
