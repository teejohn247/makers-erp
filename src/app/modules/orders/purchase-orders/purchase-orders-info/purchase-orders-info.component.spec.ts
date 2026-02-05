import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrdersInfoComponent } from './purchase-orders-info.component';

describe('PurchaseOrdersInfoComponent', () => {
  let component: PurchaseOrdersInfoComponent;
  let fixture: ComponentFixture<PurchaseOrdersInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrdersInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrdersInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
