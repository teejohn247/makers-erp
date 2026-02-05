import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfServiceLeaveRequestsComponent } from './self-service-leave-requests.component';

describe('SelfServiceLeaveRequestsComponent', () => {
  let component: SelfServiceLeaveRequestsComponent;
  let fixture: ComponentFixture<SelfServiceLeaveRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfServiceLeaveRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfServiceLeaveRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
