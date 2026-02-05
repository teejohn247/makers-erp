import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAppraisalPeriodComponent } from './create-appraisal-period.component';

describe('CreateAppraisalPeriodComponent', () => {
  let component: CreateAppraisalPeriodComponent;
  let fixture: ComponentFixture<CreateAppraisalPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAppraisalPeriodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAppraisalPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
