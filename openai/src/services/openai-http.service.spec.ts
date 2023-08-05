import { TestBed } from '@angular/core/testing';

import { OpenaiHttpService } from './openai-http.service';

describe('OpenaiHttpService', () => {
  let service: OpenaiHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenaiHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
