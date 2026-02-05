import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSalaryScalesComponent } from './assign-salary-scales.component';

describe('AssignSalaryScalesComponent', () => {
  let component: AssignSalaryScalesComponent;
  let fixture: ComponentFixture<AssignSalaryScalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSalaryScalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignSalaryScalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
