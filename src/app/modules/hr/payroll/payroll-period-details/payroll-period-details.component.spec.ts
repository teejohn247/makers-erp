import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollPeriodDetailsComponent } from './payroll-period-details.component';

describe('PayrollPeriodDetailsComponent', () => {
  let component: PayrollPeriodDetailsComponent;
  let fixture: ComponentFixture<PayrollPeriodDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollPeriodDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollPeriodDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
