import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {

  paymentInfoForm!: FormGroup;
  paymentInfoFields: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<PaymentInfoComponent>,
    private hrService: HumanResourcesService,
    private authService: AuthenticationService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.paymentInfoForm = this.fb.group({})
    console.log(this.dialogData);

    this.paymentInfoFields = [
      {
        controlName: 'accountName',
        controlType: 'text',
        controlLabel: 'Account Name',
        controlWidth: '48%',
        readonly: false,
        initialValue: this.dialogData.modalInfo.paymentInformation[0].accountName ? this.dialogData.modalInfo.paymentInformation[0].accountName : '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'accountNo',
        controlType: 'text',
        controlLabel: 'Account Number',
        controlWidth: '48%',
        readonly: false,
        initialValue: this.dialogData.modalInfo.paymentInformation[0].accountNumber ? this.dialogData.modalInfo.paymentInformation[0].accountNumber : '',
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'bankName',
        controlType: 'text',
        controlLabel: 'Bank Name',
        controlWidth: '48%',
        readonly: false,
        initialValue: this.dialogData.modalInfo.paymentInformation[0].bankName ? this.dialogData.modalInfo.paymentInformation[0].bankName : '',
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'sortCode',
        controlType: 'text',
        controlLabel: 'Sort Code',
        controlWidth: '48%',
        readonly: false,
        initialValue: this.dialogData.modalInfo.paymentInformation[0].sortCode ? this.dialogData.modalInfo.paymentInformation[0].sortCode : '',
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'bankAddress',
        controlType: 'text',
        controlLabel: 'Bank Address',
        controlWidth: '48%',
        readonly: false,
        initialValue: this.dialogData.modalInfo.paymentInformation[0].bankAddress ? this.dialogData.modalInfo.paymentInformation[0].bankAddress : '',
        validators: [],
        order: 5
      },
      {
        controlName: 'taxIdNo',
        controlType: 'text',
        controlLabel: 'Tax Identification Number',
        controlWidth: '48%',
        readonly: false,
        initialValue: this.dialogData.modalInfo.paymentInformation[0].taxIdentificationNumber ? this.dialogData.modalInfo.paymentInformation[0].taxIdentificationNumber : '',
        validators: [Validators.required],
        order: 6
      },
    ]

    this.paymentInfoFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.paymentInfoForm.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    if(this.paymentInfoForm.valid) {
      let data = {
        bankAddress: this.paymentInfoForm.value.bankAddress,
        bankName: this.paymentInfoForm.value.bankName,
        accountName: this.paymentInfoForm.value.accountName,
        accountNumber: this.paymentInfoForm.value.accountNo,
        sortCode: this.paymentInfoForm.value.sortCode,
        taxIdentificationNumber: this.paymentInfoForm.value.taxIdNo
      }
      this.hrService.updatePaymentInfo(data).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('Your payment information has been updated successfully');
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
