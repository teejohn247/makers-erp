import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCategoryInfoComponent } from './course-category-info.component';

describe('CourseCategoryInfoComponent', () => {
  let component: CourseCategoryInfoComponent;
  let fixture: ComponentFixture<CourseCategoryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseCategoryInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseCategoryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
