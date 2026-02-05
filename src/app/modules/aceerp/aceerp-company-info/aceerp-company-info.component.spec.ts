import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceerpCompanyInfoComponent } from './aceerp-company-info.component';

describe('AceerpCompanyInfoComponent', () => {
  let component: AceerpCompanyInfoComponent;
  let fixture: ComponentFixture<AceerpCompanyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AceerpCompanyInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceerpCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
