import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';

@Component({
  selector: 'app-job-post-info',
  templateUrl: './job-post-info.component.html',
  styleUrls: ['./job-post-info.component.scss']
})
export class JobPostInfoComponent implements OnInit {

  jobPostFieldData: any[];
  employees: any[] = [];
  departmentList: any[] = [];
  jobPostForm!: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<JobPostInfoComponent>,
    private fb: FormBuilder,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) {
    this.employees = this.data.employeeList;
    this.departmentList = this.data.departmentList;

    this.jobPostFieldData = [
      {
        controlName: 'jobTitle',
        controlType: 'text',
        controlLabel: 'Job Title',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'jobType',
        controlType: 'select',
        controlLabel: 'Job Type',
        controlWidth: '48%',
        initialValue: 'Online',
        selectOptions: {
          Permanent: 'Permanent',
          'Full Time': 'Full Time',
          Contract: 'Contract',
        },
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'openingDate',
        controlType: 'date',
        controlLabel: 'Opening Date',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'closingDate',
        controlType: 'date',
        controlLabel: 'Closing Date',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 7
      },
      {
        controlName: 'hiringManager',
        controlType: 'select',
        controlLabel: 'Hiring Manager',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.employees, 'fullName'),
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'department',
        controlType: 'select',
        controlLabel: 'Department',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.departmentList, 'departmentName'),
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'jobDescription',
        controlType: 'text',
        controlLabel: 'Job Description',
        controlWidth: '100%',
        initialValue: null,
        validators: [],
        order: 5
      },
    ]

    this.jobPostFieldData.sort((a,b) => (a.order - b.order));
    this.jobPostForm = this.fb.group({})

    this.jobPostFieldData.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.jobPostForm.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  //Converts an array to an Object of key value pairs
  arrayToObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    console.log(reqObj);
    return reqObj;
  }

  onSubmit() {
    console.log(this.jobPostForm.value);
    if(this.jobPostForm.valid) {
      let data = {
        jobTitle: this.jobPostForm.value.jobTitle,
        description: this.jobPostForm.value.jobDescription,
        jobType: this.jobPostForm.value.jobType,
        departmentId: this.jobPostForm.value.department,
        hiringManagerID: this.jobPostForm.value.hiringManager,
        openingDate: this.jobPostForm.value.openingDate,
        closingDate: this.jobPostForm.value.closingDate
      }
      console.log(data);
      this.hrService.createJobRole(data).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('This job role has been created successfully');
            this.dialogRef.close();
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }
  }


}
