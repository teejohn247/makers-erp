import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsPortalComponent } from './lms-portal.component';

describe('LmsPortalComponent', () => {
  let component: LmsPortalComponent;
  let fixture: ComponentFixture<LmsPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LmsPortalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmsPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
