import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceerpSystemModulesComponent } from './aceerp-system-modules.component';

describe('AceerpSystemModulesComponent', () => {
  let component: AceerpSystemModulesComponent;
  let fixture: ComponentFixture<AceerpSystemModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AceerpSystemModulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceerpSystemModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
