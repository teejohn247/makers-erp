import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAbsenceComponent } from './employee-absence.component';

describe('EmployeeAbsenceComponent', () => {
  let component: EmployeeAbsenceComponent;
  let fixture: ComponentFixture<EmployeeAbsenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeAbsenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
