import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightCarrierListComponent } from './freight-carrier-list.component';

describe('FreightCarrierListComponent', () => {
  let component: FreightCarrierListComponent;
  let fixture: ComponentFixture<FreightCarrierListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightCarrierListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreightCarrierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
