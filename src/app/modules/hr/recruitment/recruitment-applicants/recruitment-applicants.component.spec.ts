import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentApplicantsComponent } from './recruitment-applicants.component';

describe('RecruitmentApplicantsComponent', () => {
  let component: RecruitmentApplicantsComponent;
  let fixture: ComponentFixture<RecruitmentApplicantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruitmentApplicantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruitmentApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
