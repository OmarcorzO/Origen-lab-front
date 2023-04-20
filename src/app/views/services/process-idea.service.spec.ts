import { TestBed } from '@angular/core/testing';

import { ProcessIdeaService } from './process-idea.service';

describe('ProcessIdeaService', () => {
  let service: ProcessIdeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessIdeaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
