import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignManagerApproversComponent } from './assign-manager-approvers.component';

describe('AssignManagerApproversComponent', () => {
  let component: AssignManagerApproversComponent;
  let fixture: ComponentFixture<AssignManagerApproversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignManagerApproversComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignManagerApproversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
