import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentsOverviewComponent } from './departments-overview.component';

describe('DepartmentsOverviewComponent', () => {
  let component: DepartmentsOverviewComponent;
  let fixture: ComponentFixture<DepartmentsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentsOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
