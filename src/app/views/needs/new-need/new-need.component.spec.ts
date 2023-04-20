import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNeedComponent } from './new-need.component';

describe('NewNeedComponent', () => {
  let component: NewNeedComponent;
  let fixture: ComponentFixture<NewNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewNeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
