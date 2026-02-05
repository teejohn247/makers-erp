import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceerpLayoutComponent } from './aceerp-layout.component';

describe('AceerpLayoutComponent', () => {
  let component: AceerpLayoutComponent;
  let fixture: ComponentFixture<AceerpLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AceerpLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceerpLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
