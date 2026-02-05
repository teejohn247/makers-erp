import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfServicePortalComponent } from './self-service-portal.component';

describe('SelfServicePortalComponent', () => {
  let component: SelfServicePortalComponent;
  let fixture: ComponentFixture<SelfServicePortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfServicePortalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfServicePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
