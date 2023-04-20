import { TestBed } from '@angular/core/testing';

import { MeanService } from './mean.service';

describe('MeanService', () => {
  let service: MeanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
