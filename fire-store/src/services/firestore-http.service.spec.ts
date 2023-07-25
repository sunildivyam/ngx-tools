import { TestBed } from '@angular/core/testing';

import { FirestoreHttpService } from './firestore-http.service';

describe('FirestoreHttpService', () => {
  let service: FirestoreHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
