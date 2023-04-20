import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIdeationComponent } from './new-ideation.component';

describe('NewIdeationComponent', () => {
  let component: NewIdeationComponent;
  let fixture: ComponentFixture<NewIdeationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewIdeationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewIdeationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
