import { Component, Inject, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Icons } from '../../../core/constants/icons';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { EmployeeFormData } from '../../models/employee-data';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-create-single-info',
  templateUrl: './create-single-info.component.html',
  styleUrls: ['./create-single-info.component.scss']
})
export class CreateSingleInfoComponent implements OnInit {

  icons = Icons;
  apiLoading: boolean = false;
  employeeFieldData: EmployeeFormData[];
  employeeForm!: FormGroup
  type: 'text' | 'select';
  @Input() control:string;

  departmentList: any[] = [];
  designationList: any[] = [];
  branchList: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<CreateSingleInfoComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({})
    this.setUpForm();
  }

  ngOnInit(): void {
    
  }

  // }
  public transformSvg(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  setUpForm = async () => {
    this.departmentList = this.dialogData.departmentList;
    this.designationList = this.dialogData.designationList;

    this.employeeFieldData = [
      {
        controlName: 'firstName',
        controlType: 'text',
        controlLabel: 'First Name',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'lastName',
        controlType: 'text',
        controlLabel: 'Last Name',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'officialEmail',
        controlType: 'text',
        controlLabel: 'Company Email Address',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required, Validators.email],
        order: 3
      },
      {
        controlName: 'phoneNo',
        controlType: 'text',
        controlLabel: 'Phone Number',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'dateOfBirth',
        controlType: 'date',
        controlLabel: 'Date of Birth',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'gender',
        controlType: 'select',
        controlLabel: 'Gender',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: {
          Male: 'Male',
          Female: 'Female'
        },
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'employmentStartDate',
        controlType: 'date',
        controlLabel: 'Employment Start Date',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 9
      },
      {
        controlName: 'employmentType',
        controlType: 'select',
        controlLabel: 'Employment Type',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: {
          Contract: 'Contract',
          Permanent: 'Permanent'
        },
        validators: [Validators.required],
        order: 10
      },
      {
        controlName: 'designation',
        controlType: 'select',
        controlLabel: 'Designation',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.designationList, 'designationName'),
        validators: [Validators.required],
        order: 11
      },
      {
        controlName: 'department',
        controlType: 'select',
        controlLabel: 'Department',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.departmentList, 'departmentName'),
        validators: [Validators.required],
        order: 7
      },
      {
        controlName: 'branch',
        controlType: 'select',
        controlLabel: 'Branch',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.branchList, 'branchName'),
        validators: [Validators.required],
        order: 8
      },
      {
        controlName: 'role',
        controlType: 'text',
        controlLabel: 'Role',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 8
      },
    ]

    this.employeeFieldData.sort((a,b) => (a.order - b.order));

    this.employeeFieldData.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.employeeForm.addControl(field.controlName, formControl)
    });
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

  createEmployee() {
    this.apiLoading = true;
    let info = {
      firstName: this.employeeForm.value.firstName,
      lastName: this.employeeForm.value.lastName,
      email: this.employeeForm.value.officialEmail,
      phoneNumber: this.employeeForm.value.phoneNo,
      dateOfBirth: this.datePipe.transform(this.employeeForm.value.dateOfBirth, 'dd-M-yyyy'),
      gender: this.employeeForm.value.gender,
      departmentId: this.employeeForm.value.department,
      companyRole: this.employeeForm.value.role,
      designationId: this.employeeForm.value.designation,
      employmentStartDate: this.employeeForm.value.employmentStartDate,
      employmentType: this.employeeForm.value.employmentType
    }
    console.log(info);

    this.hrService.createEmployee(info).subscribe({
      next: res => {
        // console.log(res);
        if(res.status == 200) {
          this.apiLoading = false;
          this.notifyService.showSuccess('This employee has been created successfully');
          this.closeDialog();
        }
        // this.getPageData();
      },
      error: err => {
        console.log(err)
        this.notifyService.showError(err.error.error);
        this.apiLoading = false;
      } 
    })
  }
  // get f() {
  //   return this.employeeForm.controls;
  // }

  // get formControl() :AbstractControl {
  //   return this.employeeForm.get(this.control) as AbstractControl;
  // }

  // get isNotValid() {
  //   return this.formControl.invalid && (this.formControl.touched || this.formControl.dirty)
  // }

}
