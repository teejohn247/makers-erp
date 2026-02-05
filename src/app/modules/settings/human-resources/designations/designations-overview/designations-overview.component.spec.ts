import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationsOverviewComponent } from './designations-overview.component';

describe('DesignationsOverviewComponent', () => {
  let component: DesignationsOverviewComponent;
  let fixture: ComponentFixture<DesignationsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignationsOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
