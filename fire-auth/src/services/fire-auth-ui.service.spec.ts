import { TestBed } from '@angular/core/testing';

import { FireAuthUiService } from './fire-auth-ui.service';

describe('FireAuthUiService', () => {
  let service: FireAuthUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireAuthUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
