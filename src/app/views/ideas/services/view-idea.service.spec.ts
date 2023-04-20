import { TestBed } from '@angular/core/testing';

import { ViewIdeaService } from './view-idea.service';

describe('ViewIdeaService', () => {
  let service: ViewIdeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewIdeaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
