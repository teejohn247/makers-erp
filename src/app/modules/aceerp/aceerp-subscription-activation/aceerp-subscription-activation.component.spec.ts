import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceerpSubscriptionActivationComponent } from './aceerp-subscription-activation.component';

describe('AceerpSubscriptionActivationComponent', () => {
  let component: AceerpSubscriptionActivationComponent;
  let fixture: ComponentFixture<AceerpSubscriptionActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AceerpSubscriptionActivationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceerpSubscriptionActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
