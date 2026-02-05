import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentApplicantFormComponent } from './recruitment-applicant-form.component';

describe('RecruitmentApplicantFormComponent', () => {
  let component: RecruitmentApplicantFormComponent;
  let fixture: ComponentFixture<RecruitmentApplicantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruitmentApplicantFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentApplicantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
