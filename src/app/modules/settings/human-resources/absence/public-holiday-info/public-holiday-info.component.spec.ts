import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicHolidayInfoComponent } from './public-holiday-info.component';

describe('PublicHolidayInfoComponent', () => {
  let component: PublicHolidayInfoComponent;
  let fixture: ComponentFixture<PublicHolidayInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicHolidayInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicHolidayInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
