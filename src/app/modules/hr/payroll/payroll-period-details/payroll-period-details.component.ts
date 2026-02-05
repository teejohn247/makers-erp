import { Component, Inject, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';


@Component({
  selector: 'app-payroll-period-details',
  templateUrl: './payroll-period-details.component.html',
  styleUrls: ['./payroll-period-details.component.scss']
})
export class PayrollPeriodDetailsComponent implements OnInit {

  @Input() data:any;
  payrollPeriodData: FormFields[];
  payrollPeriodForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) {
    
  }

  ngOnInit(): void {
    this.payrollPeriodForm = this.fb.group({})

    console.log(this.data);

    this.payrollPeriodData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.name : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'description',
        controlType: 'text',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.description : null,
        validators: null,
        order: 2
      },
      {
        controlName: 'startDate',
        controlType: 'date',
        controlLabel: 'Start Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.startDate : null,
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'endDate',
        controlType: 'date',
        controlLabel: 'End Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.endDate : null,
        validators: [Validators.required],
        order: 4
      }
    ]

    this.payrollPeriodData.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.payrollPeriodForm.addControl(field.controlName, formControl)
    })
  }

  onSubmit() {
    if(this.payrollPeriodForm.valid) {
      let data = {
        payrollPeriodName: this.payrollPeriodForm.value.name,
        description: this.payrollPeriodForm.value.description,
        startDate: this.payrollPeriodForm.value.startDate,
        endDate: this.payrollPeriodForm.value.endDate
      }
      console.log(data);
      if(this.data.modalInfo?.name) {
        this.hrService.updatePayrollPeriod(data, this.data.id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              if(this.data.isExisting) this.notifyService.showSuccess('This payroll period has been updated successfully');
              else this.notifyService.showSuccess('This payroll period has been created successfully');
            }
            //this.getPageData();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
      else {
        this.hrService.createPayrollPeriod(data).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('The payroll period has been created successfully');
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
}
