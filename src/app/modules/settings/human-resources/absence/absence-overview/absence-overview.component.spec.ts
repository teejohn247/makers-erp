import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceOverviewComponent } from './absence-overview.component';

describe('AbsenceOverviewComponent', () => {
  let component: AbsenceOverviewComponent;
  let fixture: ComponentFixture<AbsenceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenceOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
