import { TestBed } from '@angular/core/testing';

import { IdeationService } from './ideation.service';

describe('IdeationService', () => {
  let service: IdeationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdeationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
