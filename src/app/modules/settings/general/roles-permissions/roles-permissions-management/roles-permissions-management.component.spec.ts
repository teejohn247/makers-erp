import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPermissionsManagementComponent } from './roles-permissions-management.component';

describe('RolesPermissionsManagementComponent', () => {
  let component: RolesPermissionsManagementComponent;
  let fixture: ComponentFixture<RolesPermissionsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesPermissionsManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesPermissionsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
