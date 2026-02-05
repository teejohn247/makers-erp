import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfServicePayrollComponent } from './self-service-payroll.component';

describe('SelfServicePayrollComponent', () => {
  let component: SelfServicePayrollComponent;
  let fixture: ComponentFixture<SelfServicePayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfServicePayrollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfServicePayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
