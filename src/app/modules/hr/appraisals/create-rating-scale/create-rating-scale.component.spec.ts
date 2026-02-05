import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRatingScaleComponent } from './create-rating-scale.component';

describe('CreateRatingScaleComponent', () => {
  let component: CreateRatingScaleComponent;
  let fixture: ComponentFixture<CreateRatingScaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRatingScaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRatingScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
