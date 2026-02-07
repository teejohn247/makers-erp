import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalReportsComponent } from './appraisal-reports.component';

describe('AppraisalReportsComponent', () => {
  let component: AppraisalReportsComponent;
  let fixture: ComponentFixture<AppraisalReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppraisalReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppraisalReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
