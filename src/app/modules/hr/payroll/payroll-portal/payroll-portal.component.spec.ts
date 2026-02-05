import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollPortalComponent } from './payroll-portal.component';

describe('PayrollPortalComponent', () => {
  let component: PayrollPortalComponent;
  let fixture: ComponentFixture<PayrollPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollPortalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
