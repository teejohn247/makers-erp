import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceerpCompanyDetailsComponent } from './aceerp-company-details.component';

describe('AceerpCompanyDetailsComponent', () => {
  let component: AceerpCompanyDetailsComponent;
  let fixture: ComponentFixture<AceerpCompanyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AceerpCompanyDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceerpCompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
