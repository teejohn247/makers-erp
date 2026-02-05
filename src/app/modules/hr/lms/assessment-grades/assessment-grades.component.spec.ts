import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentGradesComponent } from './assessment-grades.component';

describe('AssessmentGradesComponent', () => {
  let component: AssessmentGradesComponent;
  let fixture: ComponentFixture<AssessmentGradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentGradesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
