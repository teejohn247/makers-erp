import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-payroll-credit-info',
  templateUrl: './payroll-credit-info.component.html',
  styleUrls: ['./payroll-credit-info.component.scss']
})
export class PayrollCreditInfoComponent implements OnInit {

  payrollFieldData: FormFields[];
  payrollCreditForm!: FormGroup;
  apiLoading:boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PayrollCreditInfoComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.payrollCreditForm = this.fb.group({})

    this.payrollFieldData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.name : this.data.name,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.description : null,
        validators: null,
        order: 2
      }
    ]

    this.payrollFieldData.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.payrollCreditForm.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.payrollCreditForm.valid) {
      this.apiLoading = true
      let data = {
        name: this.payrollCreditForm.value.name,
        description: this.payrollCreditForm.value.description
      }
      console.log(this.data);
      if(this.data.modalInfo?.name) {
        this.hrService.updatePayrollCredits(data, this.data.id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              if(this.data.isExisting) this.notifyService.showSuccess('This payroll credit has been updated successfully');
              else this.notifyService.showSuccess('This payroll credit has been created successfully');
              this.apiLoading = false;
              this.dialogRef.close();
            }
            //this.getPageData();
          },
          error: err => {
            this.apiLoading = false;
            this.notifyService.showError(err.error.error);
          } 
        })
      }
      else {
        this.hrService.createPayrollCredit(data).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This payroll credit type has been created successfully');
              this.apiLoading = false;
              this.dialogRef.close();
            }
            //this.getPageData();
          },
          error: err => {
            this.apiLoading = false
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    }
  }  

}
