import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';


@Component({
  selector: 'app-create-kpi-group',
  templateUrl: './create-kpi-group.component.html',
  styleUrls: ['./create-kpi-group.component.scss']
})
export class CreateKpiGroupComponent implements OnInit {

  loggedInUser: any;
  kpiGroupFields: FormFields[];
  kpiGroupForm!: FormGroup;
  departmentList: any[] = [];
  apiLoading:boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateKpiGroupComponent>,
    private authService: AuthenticationService,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser.data;
    console.log(this.loggedInUser)

    this.departmentList = this.data.departments;
    console.log(this.data.modalInfo);
    this.kpiGroupForm = this.fb.group({})

    this.kpiGroupFields = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.groupName : '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'type',
        controlType: 'select',
        controlLabel: 'Measure',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.type : 'percentage',
        selectOptions: {
          percentage: 'Percentage',
          exact: 'Exact'
        },
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'accessLevel',
        controlType: 'select',
        controlLabel: 'Access Level',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.accessLevel : 'Admin',
        selectOptions: this.loggedInUser.isSuperAdmin ? 
        {
          Admin: 'Admin',
          Manager: 'Manager',
          Employee: 'Employee'
        } : {
          Manager: 'Manager',
          Employee: 'Employee'
        },
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'departmentIds',
        controlType: 'mutipleSelect',
        controlLabel: 'Departments',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.assignedDepartments.filter(x => x.department_name).map(y => y.department_id) : null,
        selectOptions: this.arrayToObject(this.departmentList, 'departmentName'),
        validators: [],
        order: 3
      },
      {
        controlName: 'weight',
        controlType: 'number',
        controlLabel: 'Weight (%)',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.weight : '',
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'target',
        controlType: 'number',
        controlLabel: 'Target',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.target : '',
        validators: [],
        order: 5
      },
      {
        controlName: 'max',
        controlType: 'number',
        controlLabel: 'Max',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.max : '',
        validators: [],
        order: 6
      },
      {
        controlName: 'threshold',
        controlType: 'number',
        controlLabel: 'Threshold',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.threshold : '',
        validators: [],
        order: 7
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.description : null,
        validators: null,
        order: 8
      }
    ]

    console.log(this.kpiGroupFields)

    this.kpiGroupFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.kpiGroupForm.addControl(field.controlName, formControl)
    })

    if(!this.data.isExisting && !this.loggedInUser.isSuperAdmin && this.loggedInUser.isManager) {
      this.kpiGroupForm.controls['accessLevel'].setValue('Manager');
      // this.kpiGroupForm.controls['accessLevel'].disable();
      this.kpiGroupForm.controls['departmentIds'].setValue([this.loggedInUser.departmentId]);
      // this.kpiGroupForm.controls['departmentIds'].rea();
      let reqOptions = {}
      reqOptions[this.loggedInUser.departmentId] = this.loggedInUser.department;
      this.kpiGroupFields.find(ctrl => ctrl.controlName == 'departmentIds').selectOptions = reqOptions
      console.log(this.kpiGroupForm.value)
    }

    if(this.data.isExisting && !this.loggedInUser.isSuperAdmin) {
      this.kpiGroupForm.controls['accessLevel'].disable();
    }

    // this.kpiGroupForm.controls['type'].valueChanges.subscribe(val => {
    //   this.kpiGroupFields.find(x => {
    //     if(x.controlName == 'max' || x.controlName == 'target' || x.controlName == 'threshold') {
    //       x.controlLabel = val == 'percentage' ? x.controlLabel.split(" ")[0] + ' (%)' : x.controlLabel.split(" ")[0] + ' (₦)'
    //     }
    //   })
    // })
  }

  onSubmit() {
    if(this.kpiGroupForm.valid) {
      this.apiLoading = true
      let data = {
        name: this.kpiGroupForm.value.name,
        description: this.kpiGroupForm.value.description,
        departments: this.kpiGroupForm.value.departmentIds,
        weight: this.kpiGroupForm.value.weight,
        target: this.kpiGroupForm.value.target,
        max: this.kpiGroupForm.value.max,
        threshold: this.kpiGroupForm.value.threshold,
        type: this.kpiGroupForm.value.type,
        accessLevel: this.loggedInUser.isSuperAdmin ? this.kpiGroupForm.value.accessLevel : 'Manager'
      }
      console.log(this.data);
      if(this.data.isExisting) {
        this.hrService.updateKpiGroup(data, this.data.modalInfo._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.apiLoading = false;
              this.notifyService.showSuccess('This KPI group has been updated successfully');
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
      else {
        this.hrService.createKpiGroup(data).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.apiLoading = false;
              this.notifyService.showSuccess('This KPI group has been created successfully');
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
  }

  removeDept(deptName: string) {
    const selectedDepts = this.kpiGroupForm.value['departmentIds'] as string[];
    this.removeFirst(selectedDepts, deptName);
    this.kpiGroupForm.get['departmentIds'].setValue(selectedDepts); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
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

  showDept(deptId) {
    console.log(deptId);
    return this.kpiGroupFields[3].selectOptions[deptId];
  }

}
