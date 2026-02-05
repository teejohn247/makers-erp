import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateKpiComponent } from './create-kpi.component';

describe('CreateKpiComponent', () => {
  let component: CreateKpiComponent;
  let fixture: ComponentFixture<CreateKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateKpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
