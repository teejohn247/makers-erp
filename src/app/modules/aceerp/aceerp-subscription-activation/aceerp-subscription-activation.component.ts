import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { AceerpService } from 'src/app/shared/services/aceerp/aceerp.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-aceerp-subscription-activation',
  templateUrl: './aceerp-subscription-activation.component.html',
  styleUrls: ['./aceerp-subscription-activation.component.scss']
})
export class AceerpSubscriptionActivationComponent implements OnInit {

  subscriptionInfoFields: FormFields[];
  subscriptionInfoGroupForm!: FormGroup;
  moduleList: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AceerpSubscriptionActivationComponent>,
    private aceerpService: AceerpService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.moduleList = this.data.moduleList;
    console.log(this.moduleList);
    this.subscriptionInfoGroupForm = this.fb.group({})

    this.subscriptionInfoFields = [
      {
        controlName: 'subscriptionPlan',
        controlType: 'select',
        controlLabel: 'Subscription Plan',
        controlWidth: '48%',
        initialValue: null,
        selectOptions: this.arrayToObject(data.subscriptionPlans, 'subscriptionName'),
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'subscriptionCycle',
        controlType: 'select',
        controlLabel: 'Subscription Cycle',
        controlWidth: '48%',
        initialValue: null,
        selectOptions: {
          biweekly: 'BiWeekly',
          monthly: 'Monthly',
          annualy: 'Annualy'
        },
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'numberOfUsers',
        controlType: 'select',
        controlLabel: 'Number of Users',
        controlWidth: '100%',
        initialValue: null,
        selectOptions: {
          '1-20': '1-20',
          '21-50': '21-50',
          '51-100': '51-100',
          '101-200': '101-200',
          '201-500': '201-500',
          '500 & above': '500 & above'
        },
        validators: [Validators.required],
        order: 3
      },
      // {
      //   controlName: 'noOfUsers',
      //   controlType: 'text',
      //   controlLabel: 'Number of Users',
      //   controlWidth: '48%',
      //   initialValue: null,
      //   validators: [Validators.required],
      //   order: 4
      // },       
      // {
      //   controlName: 'startDate',
      //   controlType: 'date',
      //   controlLabel: 'Start Date',
      //   controlWidth: '48%',
      //   initialValue: this.data.isExisting ? this.data.modalInfo.startDate : null,
      //   validators: [Validators.required],
      //   order: 3
      // },
      // {
      //   controlName: 'endDate',
      //   controlType: 'date',
      //   controlLabel: 'End Date',
      //   controlWidth: '48%',
      //   initialValue: this.data.isExisting ? this.data.modalInfo.endDate : null,
      //   validators: [Validators.required],
      //   order: 4
      // },
      // {
      //   controlName: 'moduleIds',
      //   controlType: 'mutipleSelect',
      //   controlLabel: 'Modules',
      //   controlWidth: '100%',
      //   initialValue: '',
      //   selectOptions: this.arrayToObject(this.moduleList, 'moduleName'),
      //   validators: [Validators.required],
      //   order: 5
      // },
    ]

    this.subscriptionInfoFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.subscriptionInfoGroupForm.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {
  }

  removeModule(name: string) {
    const selectedModules = this.subscriptionInfoGroupForm.value['moduleIds'] as string[];
    this.removeFirst(selectedModules, name);
    this.subscriptionInfoGroupForm.get['moduleIds'].setValue(selectedModules); // To trigger change detection
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

  onSubmit() {
    if(this.subscriptionInfoGroupForm.valid) {
      let data = {
        subscriptionPlanId: this.subscriptionInfoGroupForm.value.subscriptionPlan,
        subscriptionCycle: this.subscriptionInfoGroupForm.value.subscriptionCycle,
        userRange: this.subscriptionInfoGroupForm.value.numberOfUsers,
        companyId: this.data.companyId
      }
      console.log(data);
      this.aceerpService.activateSubscription(data).subscribe({
        next: res => {
          // console.log(res);
          if(res.success == true) {
            this.notifyService.showSuccess('This subscription was activated successfully');
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
