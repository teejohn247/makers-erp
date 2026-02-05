import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStockHistoryComponent } from './product-stock-history.component';

describe('ProductStockHistoryComponent', () => {
  let component: ProductStockHistoryComponent;
  let fixture: ComponentFixture<ProductStockHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductStockHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductStockHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
