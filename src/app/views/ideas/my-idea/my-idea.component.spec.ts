import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyIdeaComponent } from './my-idea.component';

describe('MyIdeaComponent', () => {
  let component: MyIdeaComponent;
  let fixture: ComponentFixture<MyIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyIdeaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
