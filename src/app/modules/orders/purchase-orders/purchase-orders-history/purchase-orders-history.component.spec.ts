import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrdersHistoryComponent } from './purchase-orders-history.component';

describe('PurchaseOrdersHistoryComponent', () => {
  let component: PurchaseOrdersHistoryComponent;
  let fixture: ComponentFixture<PurchaseOrdersHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrdersHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrdersHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
