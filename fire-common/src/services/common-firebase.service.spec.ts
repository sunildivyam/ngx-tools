import { TestBed } from '@angular/core/testing';

import { CommonFirebaseService } from './common-firebase.service';

describe('CommonFirebaseService', () => {
  let service: CommonFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
