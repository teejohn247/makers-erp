import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightCarrierInfoComponent } from './freight-carrier-info.component';

describe('FreightCarrierInfoComponent', () => {
  let component: FreightCarrierInfoComponent;
  let fixture: ComponentFixture<FreightCarrierInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightCarrierInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreightCarrierInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
