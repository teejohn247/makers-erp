import { Component, Inject, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { EmployeeFormData } from 'src/app/shared/models/employee-data';
import { Countries } from 'src/app/core/constants/country-list';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {

  officialTabActive: boolean = true;
  profileImgFile: File;
  profilePic: string | SafeUrl = 'https://onburdstorageaccount.blob.core.windows.net/onburd/public/onburd_fe/assets/onburd-corporate/images/user_profile_icon.svg';

  officialInfoFields: EmployeeFormData[];
  officialInfoForm!: FormGroup;
  personalInfoFields: any;
  personalInfoForm!: FormGroup;

  departmentList: any[] = [];
  designationList: any[] = [];
  employeeDetails: any;
  loggedInUser: any;
  apiLoading: boolean = false;
  loadingForm:boolean = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<EditEmployeeComponent>,
    private hrService: HumanResourcesService,
    private authService: AuthenticationService,     
    private notifyService: NotificationService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {
    this.officialInfoForm = this.fb.group({})
    this.personalInfoForm = this.fb.group({})
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser.data;
    this.employeeDetails = this.dialogData.employeeDetails;
    console.log(this.employeeDetails);
    
    this.setUpForm();
  }

  profilePicUpload(event) {
    this.profileImgFile = event.target.files[0];
    this.profilePic = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(event.target.files[0])
    );
    // this.fileName = this.employeesFile.name;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  setUpForm = async () => {
    this.loadingForm = true;
    this.departmentList = this.dialogData.departmentList;
    this.designationList = this.dialogData.designationList;

    this.officialInfoFields = [
      {
        controlName: 'firstName',
        controlType: 'text',
        controlLabel: 'First Name',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.employeeDetails?.firstName,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'lastName',
        controlType: 'text',
        controlLabel: 'Last Name',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.employeeDetails?.lastName,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'officialEmail',
        controlType: 'text',
        controlLabel: 'Company Email Address',
        controlWidth: '48%',
        readonly: true,
        initialValue: this.employeeDetails?.email,
        validators: [Validators.required, Validators.email],
        order: 3
      },
      {
        controlName: 'phoneNo',
        controlType: 'text',
        controlLabel: 'Phone Number',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.employeeDetails?.phoneNumber,
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'dateOfBirth',
        controlType: 'date',
        controlLabel: 'Date of Birth',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.employeeDetails?.dateOfBirth ? this.employeeDetails.dateOfBirth : '',
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'gender',
        controlType: 'select',
        controlLabel: 'Gender',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.employeeDetails?.gender[0].toUpperCase() + this.employeeDetails?.gender.substring(1),
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
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.employeeDetails && this.convertToDate(this.employeeDetails?.employmentStartDate),
        validators: [Validators.required],
        order: 9
      },
      {
        controlName: 'employmentType',
        controlType: 'select',
        controlLabel: 'Employment Type',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.employeeDetails?.employmentType,
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
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.employeeDetails?.designationId,
        selectOptions: {},
        validators: [Validators.required],
        order: 11
      },
      {
        controlName: 'department',
        controlType: 'select',
        controlLabel: 'Department',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.employeeDetails?.departmentId,
        selectOptions: {},
        validators: [Validators.required],
        order: 7
      },
      {
        controlName: 'role',
        controlType: 'text',
        controlLabel: 'Role',
        controlWidth: '48%',
        readonly: !this.loggedInUser.isSuperAdmin,
        initialValue: this.employeeDetails?.companyRole,
        validators: [Validators.required],
        order: 8
      },
    ]

    this.personalInfoFields = [
      {
        controlName: 'personalEmail',
        controlType: 'text',
        controlLabel: 'Personal Email Address',
        controlWidth: '48%',
        initialValue: this.employeeDetails?.personalEmail,
        validators: [Validators.email],
        order: 1
      },
      {
        controlName: 'personalPhoneNo',
        controlType: 'text',
        controlLabel: 'Personal Phone Number',
        controlWidth: '48%',
        initialValue: this.employeeDetails?.personalPhone,
        validators: [],
        order: 2
      },
      {
        controlName: 'address',
        controlType: 'text',
        controlLabel: 'House Address',
        controlWidth: '100%',
        initialValue: this.employeeDetails?.address,
        validators: [],
        order: 3
      },
      {
        controlName: 'city',
        controlType: 'text',
        controlLabel: 'City',
        controlWidth: '48%',
        initialValue: this.employeeDetails?.city,
        validators: [],
        order: 4
      },
      {
        controlName: 'country',
        controlType: 'select',
        controlLabel: 'Country',
        controlWidth: '48%',
        initialValue: this.employeeDetails?.country,
        selectOptions: this.createCountryOptions(),
        validators: [],
        order: 5
      },
      {
        controlName: 'maritalStatus',
        controlType: 'select',
        controlLabel: 'Marital Status',
        controlWidth: '48%',
        initialValue: this.employeeDetails?.maritalStatus,
        selectOptions: {
          Single: 'Single',
          Married: 'Married',
          Divorced: 'Divorced',
          Widow: 'Widow',
          Widower: 'Widower'
        },
        validators: [],
        order: 6
      },
      {
        controlName: 'nationality',
        controlType: 'select',
        controlLabel: 'Nationality',
        controlWidth: '48%',
        initialValue: this.employeeDetails?.nationality,
        selectOptions: this.createCountryOptions(),
        validators: [],
        order: 7
      },
      {
        controlName: 'nextOfKinName',
        controlType: 'text',
        controlLabel: 'Next of Kin Name',
        controlWidth: '48%',
        initialValue: this.employeeDetails?.nextOfKinFullName,
        validators: [],
        order: 8
      },
      {
        controlName: 'nextOfKinRelationship',
        controlType: 'text',
        controlLabel: 'Next of Kin Relationship',
        controlWidth: '48%',
        initialValue: this.employeeDetails?.nextOfKinRelationship,
        validators: [],
        order: 9
      },
      {
        controlName: 'nextOfKinPhoneNo',
        controlType: 'text',
        controlLabel: 'Next of Kin Phone No',
        controlWidth: '48%',
        initialValue: this.employeeDetails?.nextOfKinPhoneNumber,
        validators: [],
        order: 10
      },
      {
        controlName: 'nextOfKinAddress',
        controlType: 'text',
        controlLabel: 'Next of Kin Address',
        controlWidth: '48%',
        initialValue: this.employeeDetails?.nextOfKinAddress,
        validators: [],
        order: 11
      },
    ]

    this.officialInfoFields.find(item => {
      if(item.controlName == 'department') item.selectOptions = this.arrayToObject(this.departmentList, 'departmentName');
    })

    this.officialInfoFields.find(item => {
      if(item.controlName == 'designation') item.selectOptions = this.arrayToObject(this.designationList, 'designationName');
    })

    this.officialInfoFields.sort((a,b) => (a.order - b.order));
    this.personalInfoFields.sort((a,b) => (a.order - b.order));

    this.officialInfoFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.officialInfoForm.addControl(field.controlName, formControl)
    });
    this.personalInfoFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.personalInfoForm.addControl(field.controlName, formControl)
    });
    this.loadingForm = false
  }

  //Converts an array to an Object of key value pairs
  arrayToObject(arrayVar, key:string) {
    console.log(arrayVar)
    if(arrayVar && arrayVar.length > 0) {
      let reqObj = {}
      reqObj = arrayVar.reduce((agg, item, index) => {
        agg[item['_id']] = item[key];
        return agg;
      }, {})
      //console.log(reqObj);
      return reqObj;
    }
    else return {}
    
  }

  // Convert dd-mm-yyyy to date object
  convertToDate(dateString: any) {
    let d = dateString.split("-");
    let newFormat = new Date(d[2] + '-' + d[1] + '-' + d[0]);
    return newFormat;     
  }

  // Update Employee Details
  updateEmployee() {
    this.apiLoading = true;
    const formData = new FormData();

    formData.append('profilePhoto', this.profileImgFile);
    formData.append('firstName', this.officialInfoForm.value.firstName);
    formData.append('lastName', this.officialInfoForm.value.lastName);
    formData.append('officialEmail', this.officialInfoForm.value.officialEmail);
    formData.append('phoneNumber', this.officialInfoForm.value.phoneNo);
    formData.append('dateOfBirth', this.officialInfoForm.value.dateOfBirth);
    formData.append('gender', this.officialInfoForm.value.gender);
    formData.append('departmentId', this.officialInfoForm.value.department);
    formData.append('companyRole', this.officialInfoForm.value.role);
    formData.append('employmentStartDate', this.officialInfoForm.value.employmentStartDate);
    formData.append('employmentType', this.officialInfoForm.value.employmentType);
    formData.append('designationId', this.officialInfoForm.value.designation);

    formData.append('personalEmail', this.personalInfoForm.value.personalEmail ? this.personalInfoForm.value.personalEmail : '');
    formData.append('personalPhone', this.personalInfoForm.value.personalPhoneNo ? this.personalInfoForm.value.personalPhoneNo : '');
    formData.append('address', this.personalInfoForm.value.address ? this.personalInfoForm.value.address : '');
    formData.append('city', this.personalInfoForm.value.city ? this.personalInfoForm.value.city : '');
    formData.append('country', this.personalInfoForm.value.country ? this.personalInfoForm.value.country : '');
    formData.append('maritalStatus', this.personalInfoForm.value.maritalStatus ? this.personalInfoForm.value.maritalStatus : '');
    formData.append('nationality', this.personalInfoForm.value.nationality ? this.personalInfoForm.value.nationality : '');
    formData.append('nextOfKinFullName', this.personalInfoForm.value.nextOfKinName ? this.personalInfoForm.value.nextOfKinName : '');
    formData.append('nextOfKinRelationship', this.personalInfoForm.value.nextOfKinRelationship ? this.personalInfoForm.value.nextOfKinRelationship : '');
    formData.append('nextOfKinPhoneNumber', this.personalInfoForm.value.nextOfKinPhoneNo ? this.personalInfoForm.value.nextOfKinPhoneNo : '');
    formData.append('nextOfKinAddress', this.personalInfoForm.value.nextOfKinAddress ? this.personalInfoForm.value.nextOfKinAddress : '');

    // formData.forEach((value,key) => {
    //   console.log(key+" "+value)
    // });

    if(this.loggedInUser.isSuperAdmin) {
      this.hrService.updateEmployeeByAdmin(formData, this.employeeDetails._id).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('This employee has been updated successfully');
            this.apiLoading = false;
            this.dialogRef.close();
          }
          //this.getPageData();
        },
        error: err => {
          console.log(err)
          this.apiLoading = false
          this.notifyService.showError(err.error.error);
        } 
      })
    }
    else {
      this.hrService.updateEmployee(formData).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.apiLoading = false;
            this.notifyService.showSuccess('Your details have been updated successfully');
            this.dialogRef.close();
          }
          //this.getPageData();
        },
        error: err => {
          console.log(err)
          this.apiLoading = false;
          this.notifyService.showError(err.error.error);
        } 
      })
    }
  }

  createCountryOptions() {
    let reqObj = {}
    reqObj = Countries.reduce((agg, item, index) => {
      agg[item['label']] = item['label'];
      return agg;
    }, {})
    //console.log(reqObj);
    return reqObj;
  }

}
