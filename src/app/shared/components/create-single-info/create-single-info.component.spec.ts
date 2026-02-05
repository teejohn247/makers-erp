import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSingleInfoComponent } from './create-single-info.component';

describe('CreateSingleInfoComponent', () => {
  let component: CreateSingleInfoComponent;
  let fixture: ComponentFixture<CreateSingleInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSingleInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSingleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
