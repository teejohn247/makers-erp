import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralAppraisalComponent } from './general-appraisal.component';

describe('GeneralAppraisalComponent', () => {
  let component: GeneralAppraisalComponent;
  let fixture: ComponentFixture<GeneralAppraisalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralAppraisalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralAppraisalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
