import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostInfoComponent } from './job-post-info.component';

describe('JobPostInfoComponent', () => {
  let component: JobPostInfoComponent;
  let fixture: ComponentFixture<JobPostInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPostInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobPostInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
