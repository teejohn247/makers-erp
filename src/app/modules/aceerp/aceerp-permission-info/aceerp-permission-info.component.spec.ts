import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceerpPermissionInfoComponent } from './aceerp-permission-info.component';

describe('AceerpPermissionInfoComponent', () => {
  let component: AceerpPermissionInfoComponent;
  let fixture: ComponentFixture<AceerpPermissionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AceerpPermissionInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceerpPermissionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
