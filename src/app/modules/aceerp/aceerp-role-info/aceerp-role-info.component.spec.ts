import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceerpRoleInfoComponent } from './aceerp-role-info.component';

describe('AceerpRoleInfoComponent', () => {
  let component: AceerpRoleInfoComponent;
  let fixture: ComponentFixture<AceerpRoleInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AceerpRoleInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceerpRoleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
