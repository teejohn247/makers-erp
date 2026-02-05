import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierDeliveryHistoryComponent } from './courier-delivery-history.component';

describe('CourierDeliveryHistoryComponent', () => {
  let component: CourierDeliveryHistoryComponent;
  let fixture: ComponentFixture<CourierDeliveryHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierDeliveryHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierDeliveryHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
