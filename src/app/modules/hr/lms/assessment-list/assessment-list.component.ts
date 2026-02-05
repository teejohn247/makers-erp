import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';


@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss']
})
export class AssessmentListComponent implements OnInit {
  courseCategories:any;
  assessments:any[] = [];
  searchFilter:string;

  itemFilters:any[];
  filterForm: FormGroup;
  loggedInUser: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private location: Location,
    private authService: AuthenticationService,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService, 
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser.data;
    const courseCategories$ = this.hrService.getCourseCategories().subscribe(res => {
      this.courseCategories = res.data;
      console.log(this.courseCategories);
      this.itemFilters = this.courseCategories.map((x, index) => {return {id: x._id, name: x.name}});
      const formControls = this.itemFilters.map(control => new FormControl(false));
      const selectAllControl = new FormControl(false);
      this.filterForm = this.fb.group({
        itemFilters: new FormArray(formControls),
        selectAll: selectAllControl
      });
    })

    const assessments$ = this.hrService.getAssessments().subscribe(res => {
      this.assessments = res.data;
      console.log(this.assessments)
    })
    // this.courseCategories = [
    //   {
    //     id: '1',
    //     name: 'Compliance',
    //     noOfCourses: 7,
    //     totalTime: '2hrs 30mins'
    //   },
    //   {
    //     id: '2',
    //     name: 'Leadership',
    //     noOfCourses: 2,
    //     totalTime: '1hr 20mins'
    //   },
    //   {
    //     id: '3',
    //     name: 'Management',
    //     noOfCourses: 5,
    //     totalTime: '3hrs'
    //   },
    //   {
    //     id: '4',
    //     name: 'Health & Safety',
    //     noOfCourses: 10,
    //     totalTime: '7hrs'
    //   }
    // ]


    if(this.courseCategories) this.filterChange();
  }

  addNewAssessment() {
    this.router.navigate(['app/human-resources/lms/assessments/info']);
  }

  filterChange(): void {
    // Subscribe to changes on the selectAll checkbox
    this.filterForm.get('selectAll').valueChanges.subscribe(bool => {
      this.filterForm.get('itemFilters').patchValue(Array(this.itemFilters.length).fill(bool), { emitEvent: false });
    });

    // Subscribe to changes on the filter preference checkboxes
    this.filterForm.get('itemFilters').valueChanges.subscribe(val => {
      const allSelected = val.every(bool => bool);
      if (this.filterForm.get('selectAll').value !== allSelected) {
        this.filterForm.get('selectAll').patchValue(allSelected, { emitEvent: false });
      }
    });

    console.log(this.filterForm.value);
  }

  filterItems() {
    // Filter out the unselected ids
    const selectedPreferences = this.filterForm.value.itemFilters.map((checked, index) => checked ? this.itemFilters[index].id : null).filter(value => value !== null);
    //console.log(selectedPreferences);
    // Do something with the result
  }

  viewDetails(info:any) {
    this.router.navigateByUrl(`app/human-resources/lms/assessments/${info._id}`);
  }

  deleteAssessment(event:any) {
    this.notifyService.confirmAction({
      title: 'Remove Assessment',
      message: `Are you sure you want to remove ${event.title}`,
      confirmText: 'Remove Assessment',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteAssessment(event._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.success) {
              this.notifyService.showInfo('This assessment has been deleted successfully');
              this.location.back();
            }
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

}
