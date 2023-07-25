import { TestBed } from '@angular/core/testing';

import { FirebaseInterceptor } from './firebase.interceptor';

describe('FirebaseInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FirebaseInterceptor
    ]
  }));

  it('should be created', () => {
    const interceptor: FirebaseInterceptor = TestBed.inject(FirebaseInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
