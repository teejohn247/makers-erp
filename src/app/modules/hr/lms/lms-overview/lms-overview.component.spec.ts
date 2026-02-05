import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsOverviewComponent } from './lms-overview.component';

describe('LmsOverviewComponent', () => {
  let component: LmsOverviewComponent;
  let fixture: ComponentFixture<LmsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LmsOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
