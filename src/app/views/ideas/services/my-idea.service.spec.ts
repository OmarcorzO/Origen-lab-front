import { TestBed } from '@angular/core/testing';

import { MyIdeaService } from './my-idea.service';

describe('MyIdeaService', () => {
  let service: MyIdeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyIdeaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
