import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchesOverviewComponent } from './branches-overview.component';

describe('BranchesOverviewComponent', () => {
  let component: BranchesOverviewComponent;
  let fixture: ComponentFixture<BranchesOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchesOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
