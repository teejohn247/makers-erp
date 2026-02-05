import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateKpiGroupComponent } from './create-kpi-group.component';

describe('CreateKpiGroupComponent', () => {
  let component: CreateKpiGroupComponent;
  let fixture: ComponentFixture<CreateKpiGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateKpiGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateKpiGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
