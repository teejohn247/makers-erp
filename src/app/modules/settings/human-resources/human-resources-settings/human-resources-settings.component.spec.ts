import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanResourcesSettingsComponent } from './human-resources-settings.component';

describe('HumanResourcesSettingsComponent', () => {
  let component: HumanResourcesSettingsComponent;
  let fixture: ComponentFixture<HumanResourcesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HumanResourcesSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanResourcesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
