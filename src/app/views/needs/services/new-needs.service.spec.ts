import { TestBed } from '@angular/core/testing';

import { NewNeedsService } from './new-needs.service';

describe('NewNeedsService', () => {
  let service: NewNeedsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewNeedsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
