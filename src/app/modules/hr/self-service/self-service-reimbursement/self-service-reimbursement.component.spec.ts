import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfServiceReimbursementComponent } from './self-service-reimbursement.component';

describe('SelfServiceReimbursementComponent', () => {
  let component: SelfServiceReimbursementComponent;
  let fixture: ComponentFixture<SelfServiceReimbursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfServiceReimbursementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfServiceReimbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
