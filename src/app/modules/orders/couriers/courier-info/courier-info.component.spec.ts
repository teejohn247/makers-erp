import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierInfoComponent } from './courier-info.component';

describe('CourierInfoComponent', () => {
  let component: CourierInfoComponent;
  let fixture: ComponentFixture<CourierInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
