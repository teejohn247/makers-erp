import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfServiceOverviewComponent } from './self-service-overview.component';

describe('SelfServiceOverviewComponent', () => {
  let component: SelfServiceOverviewComponent;
  let fixture: ComponentFixture<SelfServiceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfServiceOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfServiceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
