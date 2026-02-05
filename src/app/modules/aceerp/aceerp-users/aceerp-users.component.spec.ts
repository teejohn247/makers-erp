import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceerpUsersComponent } from './aceerp-users.component';

describe('AceerpUsersComponent', () => {
  let component: AceerpUsersComponent;
  let fixture: ComponentFixture<AceerpUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AceerpUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceerpUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
