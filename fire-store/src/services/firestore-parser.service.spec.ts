import { TestBed } from '@angular/core/testing';

import { FirestoreParserService } from './firestore-parser.service';

describe('FirestoreParserService', () => {
  let service: FirestoreParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
