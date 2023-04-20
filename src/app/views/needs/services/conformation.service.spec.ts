import { TestBed } from '@angular/core/testing';

import { ConformationService } from './conformation.service';

describe('ConformationService', () => {
  let service: ConformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
