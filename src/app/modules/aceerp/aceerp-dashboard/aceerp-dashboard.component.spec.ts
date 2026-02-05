import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceerpDashboardComponent } from './aceerp-dashboard.component';

describe('AceerpDashboardComponent', () => {
  let component: AceerpDashboardComponent;
  let fixture: ComponentFixture<AceerpDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AceerpDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceerpDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
