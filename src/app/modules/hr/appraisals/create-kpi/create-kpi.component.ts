import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from '@shared/models/form-fields';
import { AuthenticationService } from '@services/utils/authentication.service';
import { HumanResourcesService } from '@services/hr/human-resources.service';
import { NotificationService } from '@services/utils/notification.service';

@Component({
  selector: 'app-create-kpi',
  templateUrl: './create-kpi.component.html',
  styleUrls: ['./create-kpi.component.scss']
})
export class CreateKpiComponent implements OnInit {

  kpiFields: FormFields[];
  kpiForm!: FormGroup;
  loggedInUser: any;
  apiLoading:boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateKpiComponent>,
    private authService: AuthenticationService,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser.data;
    this.kpiForm = this.fb.group({});

    console.log(this.data.modalInfo)

    this.kpiFields = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.kpiName : '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'type',
        controlType: 'select',
        controlLabel: 'Measure',
        controlWidth: '48%',
        initialValue: 'percentage',
        selectOptions: {
          percentage: 'Percentage',
          exact: 'Exact'
        },
        validators: [Validators.required],
        order: 2
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
        initialValue: this.data.isExisting ? this.data.modalInfo.kpiDescription : null,
        validators: null,
        order: 8
      }
    ]

    if(!this.data.isExisting && this.data.modalInfo.accessLevel == 'Employee' && (this.loggedInUser.isSuperAdmin || this.loggedInUser.isManager)) this.kpiFields.push(
      {
        controlName: 'employeeIds',
        controlType: 'mutipleSelect',
        controlLabel: 'Employees',
        controlWidth: '100%',
        initialValue: this.data.isExisting && this.data.modalInfo.employeeIds.length > 0  ? this.data.modalInfo.employeeIds.map(x => x._id) : [],
        selectOptions: this.arrayToObject(this.loggedInUser.isManager ? this.data.employees.filter(x => x.departmentId == this.loggedInUser.departmentId) : this.data.employees, 'fullName'),
        validators: [],
        order: 3
      }
    )

    console.log(this.kpiFields)

    this.kpiFields.sort((a,b) => (a.order - b.order));
    this.kpiFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.kpiForm.addControl(field.controlName, formControl)
    })

    // this.kpiForm.controls['type'].valueChanges.subscribe(val => {
    //   this.kpiFields.find(x => {
    //     if(x.controlName == 'max' || x.controlName == 'target' || x.controlName == 'threshold') {
    //       x.controlLabel = val == 'percentage' ? x.controlLabel.split(" ")[0] + ' (%)' : x.controlLabel.split(" ")[0] + ' (₦)'
    //     }
    //   })
    // })
  }

  onSubmit() {
    if(this.kpiForm.valid) {
      this.apiLoading = true;
      let data = {
        name: this.kpiForm.value.name,
        description: this.kpiForm.value.description,
        group: this.data.groupId,
        weight: this.kpiForm.value.weight,
        target: this.kpiForm.value.target,
        max: this.kpiForm.value.max,
        threshold: this.kpiForm.value.threshold,
        type: this.kpiForm.value.type,
        employeeIds: !this.loggedInUser.isSuperAdmin && !this.loggedInUser.isManager ? [this.loggedInUser._id] : this.kpiForm.value.employeeIds
      }
      console.log(this.data);
      if(this.data.isExisting) {
        this.hrService.updateKpi(data, this.data.modalInfo._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This KPI has been updated successfully');
              this.apiLoading = false;
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
        this.hrService.createKpi(data).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This KPI has been created successfully');
              this.dialogRef.close();
            }
            //this.getPageData();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    }
  }

  removeItem(employee: string) {
    const selectedEmployees = this.kpiForm.value['departmentIds'] as string[];
    this.removeFirst(selectedEmployees, employee);
    this.kpiForm.get['employeeIds'].setValue(selectedEmployees); // To trigger change detection
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

  getChipValue(itemId:any, ctrlName:string) {
    let fieldData = this.kpiFields.find(x => x.controlType == 'mutipleSelect' && x.controlName == ctrlName);
    // console.log(fieldData)
    return fieldData['selectOptions'][itemId]
  }
}
