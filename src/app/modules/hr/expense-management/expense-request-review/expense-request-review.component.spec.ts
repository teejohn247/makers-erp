import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseRequestReviewComponent } from './expense-request-review.component';

describe('ExpenseRequestReviewComponent', () => {
  let component: ExpenseRequestReviewComponent;
  let fixture: ComponentFixture<ExpenseRequestReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseRequestReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseRequestReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
