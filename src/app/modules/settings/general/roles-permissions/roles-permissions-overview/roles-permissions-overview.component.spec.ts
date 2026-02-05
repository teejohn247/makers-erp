import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPermissionsOverviewComponent } from './roles-permissions-overview.component';

describe('RolesPermissionsOverviewComponent', () => {
  let component: RolesPermissionsOverviewComponent;
  let fixture: ComponentFixture<RolesPermissionsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesPermissionsOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesPermissionsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
