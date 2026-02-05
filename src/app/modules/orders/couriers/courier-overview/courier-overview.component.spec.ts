import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierOverviewComponent } from './courier-overview.component';

describe('CourierOverviewComponent', () => {
  let component: CourierOverviewComponent;
  let fixture: ComponentFixture<CourierOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
