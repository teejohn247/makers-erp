import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { FormFields } from 'src/app/shared/models/form-fields';

import { CourseCategoryInfoComponent } from '../course-category-info/course-category-info.component';
import { Observable, ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit {
  courseInfoForm!: FormGroup;
  courseInfoFields: FormFields[];
  courseInView:any;

  courseCategories:any[] = [];
  courseCatOptions:any;

  employees:any[] = [];

  imgFile: File;
  imgFileName: string;
  imgPic: string | SafeUrl;
  imgUploadError:string;

  apiLoading:boolean = false;
  addCategory:boolean = false;

  courseId:string;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog,
    // @Inject(MAT_DIALOG_DATA) public dialogData: any,
    // public dialogRef: MatDialogRef<CustomerInfoComponent>,
    @Inject(HumanResourcesService) private hrService: HumanResourcesService,
    @Inject(OrdersService) private ordersService: OrdersService,
    @Inject(NotificationService) private notifyService: NotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.courseId = this.activatedRoute.snapshot.params["id"];
    //console.log(this.assessmentId);

    if(this.courseId) {
      this.getCourseDetails();
    }
    else {
      this.getPageData();
    }

    this.courseInfoForm && this.courseInfoForm.valueChanges.subscribe(val => {
      // console.log(val)
      if(this.courseInfoForm.value.courseCategory == 'other') {
        this.openCategoryModal();
        this.addCategory = true;
        this.courseInfoForm.controls['courseCategory'].setValue('');
      }
      else if(this.courseInfoForm.value.courseCategory && this.courseInfoForm.value.courseCategory != 'other')  {
        this.addCategory = false
      }
    })
  }

  getCourseDetails() {
    this.hrService.getCourse(this.courseId).subscribe(res => {
      this.courseInView = res.data.course;
      console.log(this.courseInView);
      this.getPageData();
      this.imgPic = this.courseInView.thumbnail;
    })
  }

  getCourseCats()  {
    this.courseCatOptions = this.arrayToCatObject(this.courseCategories, 'name');
    //console.log(this.courseCatOptions)
    this.courseInfoFields.find(item => {
      if(item.controlName == 'courseCategory') item.selectOptions = this.courseCatOptions;
    })
  }

  getPageData() {
    this.courseInfoForm = this.fb.group({});
    this.setUpForm();
    const employees$ = this.hrService.getEmployees().subscribe(res => {
      this.employees = res.data;
      this.courseInfoFields.find(item => {
        if(item.controlName == 'courseManager') item.selectOptions = this.arrayToObject(this.employees, 'fullName');
      })
    });

    const courseCategories$ = this.hrService.getCourseCategories().subscribe(res => {
      this.courseCategories = res.data;
      console.log(this.courseCategories);
      this.getCourseCats();
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
    // ];
    
  }

  setUpForm = async () => {
      
    this.courseInfoFields = [
      {
        controlName: 'courseName',
        controlType: 'text',
        controlLabel: 'Course Name',
        controlWidth: '48%',
        initialValue: this.courseInView ? this.courseInView.title : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'courseCategory',
        controlType: 'modifyOptions',
        controlLabel: 'Course Category',
        controlWidth: '48%',
        initialValue: this.courseInView ? this.courseInView.categoryId : null,
        selectOptions: {},
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'skillLevel',
        controlType: 'select',
        controlLabel: 'Skill Level',
        controlWidth: '48%',
        initialValue: this.courseInView ? this.courseInView.level : null,
        selectOptions: {
          Beginner: 'Beginner',
          Intermediate: 'Intermediate',
          Advanced: 'Advanced'
        },
        validators: null,
        order: 3
      },
      {
        controlName: 'courseManager',
        controlType: 'select',
        controlLabel: 'Course Manager',
        controlWidth: '48%',
        initialValue: this.courseInView ? this.courseInView.courseManager._id : null,
        selectOptions: {},
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'videoUrl',
        controlType: 'text',
        controlLabel: 'Video URL',
        controlWidth: '100%',
        initialValue: this.courseInView ? this.courseInView.videoUrl : null,
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'courseDuration',
        controlType: 'number',
        controlLabel: 'Course Duration (mins)',
        controlWidth: '48%',
        initialValue: this.courseInView ? this.courseInView.duration : null,
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'courseDeadline',
        controlType: 'date',
        controlLabel: 'Course Deadline',
        controlWidth: '48%',
        initialValue: null,
        validators: [],
        order: 7
      },
      // {
      //   controlName: 'partNo',
      //   controlType: 'text',
      //   controlLabel: 'Part Number',
      //   controlWidth: '48%',
      //   initialValue: null,
      //   validators: [Validators.required],
      //   order: 6
      // },
      // {
      //   controlName: 'productWeight',
      //   controlType: 'number',
      //   controlLabel: 'Product Weight',
      //   controlWidth: '48%',
      //   initialValue: '',
      //   validators: [],
      //   order: 7
      // },
      {
        controlName: 'courseDescription',
        controlType: 'quillEditor',
        controlLabel: 'Course Description',
        controlWidth: '100%',
        initialValue: this.courseInView ? this.courseInView.description : null,
        validators: [],
        order: 15
      },
    ]
    this.courseInfoFields.sort((a,b) => (a.order - b.order));

    this.courseInfoFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.courseInfoForm.addControl(field.controlName, formControl)
    });
  }

  goBack() {
    this.location.back();
  }
  
  fileImgUpload(event) {
    this.imgFile = event.target.files[0];
    const img = new Image();
    let imgWidth;
    let imgHeight;
    let imgRatio;
    img.src = window.URL.createObjectURL(event.target.files[0]);
    img.onload = () => {
      if (this.imgFile.size > 1000000) {
        this.imgUploadError = 'Please check that your image size is not more than 1MB';
        this.imgFileName = '';
        this.imgFile = null
      }
      else {
        this.imgUploadError = '';
        this.imgFileName = this.imgFile.name;
        this.imgPic = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(this.imgFile)
        );
        // let imgBase64:string;
        // this.convertFile(this.imgFile).subscribe(val => {
        //   imgBase64 = val
        //   this.courseInfoForm.controls['thumbnail'].setValue(imgBase64);
        // })
      }
    }

  }

  //Converts an array to an Object of key value pairs
  arrayToCatObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    reqObj = {
      ...reqObj,
      'other': 'Add New Category'
    }
    return reqObj;
  }

  arrayToObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    //console.log(reqObj)
    return reqObj;
  }

  addNewCategory() {
    if(this.addCategory) {
      this.openCategoryModal();
    }
  }

  openCategoryModal() {
    let dialogRef = this.dialog.open(CourseCategoryInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        isExisting: false,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log('New Category', res)
      if(res.data) {
        this.courseInfoForm.controls['courseCategory'].setValue(res.data._id);
        console.log(this.courseInfoForm)
        this.getCourseCats();
      }
    }); 
  }

  // convertFile(file : File) : Observable<string> {
  //   const result = new ReplaySubject<string>(1);
  //   const reader = new FileReader();
  //   reader.readAsBinaryString(file);
  //   reader.onload = (event) => result.next(btoa(event.target.result.toString()));
  //   return result
  // }

  onSubmit() {
    console.log(this.courseInfoForm.value)
    if(this.courseInfoForm.valid) {
      this.apiLoading = true;
      const formData = new FormData();
      formData.append('thumbnail', this.courseId ? this.courseInView.thumbnail : this.imgFile);
      formData.append('title', this.courseInfoForm.value.courseName);
      formData.append('categoryId', this.courseInfoForm.value.courseCategory);
      formData.append('level', this.courseInfoForm.value.skillLevel);
      formData.append('courseManager', this.courseInfoForm.value.courseManager);
      formData.append('videoUrl', this.courseInfoForm.value.videoUrl);
      formData.append('duration', this.courseInfoForm.value.courseDuration);
      formData.append('courseDeadline', this.courseInfoForm.value.courseDeadline);
      formData.append('description', this.courseInfoForm.value.courseDescription);

      if(this.courseId) {
        this.hrService.updateCourse(formData, this.courseId).subscribe({
          next: res => {
            console.log(res);
            if(res.success) {
              this.notifyService.showSuccess('This course has been updated successfully');
              this.apiLoading = false;
              this.getCourseDetails();
            }
            //this.getPageData();
          },
          error: err => {
            console.log(err);
            this.apiLoading = false;
            this.notifyService.showError(err.error.error);
          } 
        })
      }
      else {
        this.hrService.createCourse(formData).subscribe({
          next: res => {
            console.log(res);
            if(res.success) {
              this.notifyService.showSuccess('This course has been created successfully');
              this.apiLoading = false;
              this.router.navigateByUrl(`app/human-resources/lms/courses`);
            }
            //this.getPageData();
          },
          error: err => {
            console.log(err);
            this.apiLoading = false;
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    }    
  }
}
