import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSystemRolesComponent } from './select-system-roles.component';

describe('SelectSystemRolesComponent', () => {
  let component: SelectSystemRolesComponent;
  let fixture: ComponentFixture<SelectSystemRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectSystemRolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSystemRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
