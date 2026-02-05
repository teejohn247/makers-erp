import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss']
})
export class CoursesListComponent implements OnInit {
  userDetails: any;
  courseCategories!:any;
  courses:any[] = [];
  searchFilter:string;

  itemFilters:any[];
  filterForm: FormGroup;
  loggedInUser: any;

  constructor(
    private route: Router,
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

    const course$ = this.hrService.getCourses().subscribe(res => {
      this.courses = res.data.courses;
      console.log(this.courses)
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

    // this.courses = [
    //   {
    //     name: 'Project Management PIMP & ACAP',
    //     category: 'Management',
    //     thumbnail: 'https://greenpeg.com/wp-content/uploads/2023/03/workers.jpeg',
    //     noOfParticipants: 10,
    //     duration: '2hr 10mins',
    //     rating: 4.5
    //   },
    //   {
    //     name: 'HSE Compliance',
    //     category: 'Compliance',
    //     thumbnail: 'https://bgsnigerialimited.com/wp-content/uploads/2024/03/equipment-Lease.jpg',
    //     noOfParticipants: 20,
    //     duration: '1hr 15mins',
    //     rating: 3.5
    //   },
    //   {
    //     name: 'Sexual harrasment in the workplace',
    //     category: 'Compliance',
    //     thumbnail: 'assets/images/illustrations/sexual-harrasment.jpg',
    //     noOfParticipants: 6,
    //     duration: '1hr',
    //     rating: 4.8
    //   },
    //   {
    //     name: 'Managing surbodinates effectively',
    //     category: 'Leadership',
    //     thumbnail: 'assets/images/illustrations/leadership.png',
    //     noOfParticipants: 6,
    //     duration: '4hr',
    //     rating: 4
    //   }
    // ]

    this.userDetails = this.authService.loggedInUser.data;
    

    if(this.itemFilters) this.filterChange();
  }

  addNewCourse() {
    this.route.navigate(['app/human-resources/lms/courses/info']);
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
    console.log(info)
    this.route.navigateByUrl(`app/human-resources/lms/courses/${info._id}`);
  }

  deleteCourse(event:any) {
    this.notifyService.confirmAction({
      title: 'Remove Course',
      message: `Are you sure you want to remove ${event.title}`,
      confirmText: 'Remove Course',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteCourse(event._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.success) {
              this.notifyService.showInfo('This course has been deleted successfully');
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
