import { TestBed } from '@angular/core/testing';

import { ImageBrowserService } from './image-browser.service';

describe('ImageBrowserService', () => {
  let service: ImageBrowserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageBrowserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
