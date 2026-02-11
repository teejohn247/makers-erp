import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-expense-request-review',
  templateUrl: './expense-request-review.component.html',
  styleUrls: ['./expense-request-review.component.scss']
})
export class ExpenseRequestReviewComponent implements OnInit {

  expenseRequestFields: FormFields[];
  expenseForm!: FormGroup;

  attachmentFile: File;
  attachmentName: string | SafeUrl = 'https://onburdstorageaccount.blob.core.windows.net/onburd/public/onburd_fe/assets/onburd-corporate/images/user_profile_icon.svg';


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<ExpenseRequestReviewComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {
    this.expenseForm = this.fb.group({})
    console.log(this.data.expenseTypes);

    this.expenseRequestFields = [
      {
        controlName: 'expenseType',
        controlType: 'select',
        controlLabel: 'Expense Type',
        controlWidth: '100%',
        readonly: this.data.forApproval,
        initialValue: this.data.modalInfo.expenseTypeId,
        selectOptions: {},
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'expenseDate',
        controlType: 'date',
        controlLabel: 'Expense Date',
        controlWidth: '48%',
        readonly: this.data.forApproval,
        initialValue: this.data.modalInfo.expenseDate,
        validators: [Validators.required],
        order: 2
      },
      // {
      //   controlName: 'currency',
      //   controlType: 'select',
      //   controlLabel: 'Currency',
      //   controlWidth: '48%',
      //   initialValue: '',
      //   selectOptions: {
      //     '(#)Naira': '(#)Naira',
      //     '($)Dollar': '($)Dollar',
      //     '(£)Pounds': '(£)Pounds',
      //     '(€)Euro': '(€)Euro'
      //   },
      //   validators: [Validators.required],
      //   order: 3
      // },
      {
        controlName: 'amount',
        controlType: 'text',
        controlLabel: 'Amount',
        controlWidth: '48%',
        readonly: this.data.forApproval,
        initialValue: this.data.modalInfo.amount,
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'upload',
        controlType: 'file',
        controlLabel: 'Attachment',
        controlWidth: '100%',
        readonly: this.data.forApproval,
        initialValue: this.data.modalInfo.attachment,
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'description',
        controlType: 'text',
        controlLabel: 'Description',
        controlWidth: '100%',
        readonly: this.data.forApproval,
        initialValue: this.data.modalInfo.description,
        validators: [Validators.required],
        order: 6
      }
    ]

    if(this.data.forApproval) {
      this.expenseRequestFields.push({
        controlName: 'decisionReason',
        controlType: 'textarea',
        controlLabel: 'Reason for decision',
        controlWidth: '100%',
        readonly: false,
        initialValue: '',
        validators: null,
        order: 6
      })
    }

    this.expenseRequestFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.expenseForm.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {

    this.hrService.getExpenseTypes().subscribe((res:any) => {
      this.expenseRequestFields.find(x => x.controlName == 'expenseType').selectOptions = this.arrayToObject(res.data, 'expenseType')
    })
  }

  //Converts an array to an Object of key value pairs
  arrayToObject(arrayVar, key:string) {
    console.log(arrayVar);
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    console.log(reqObj);
    return reqObj;
  }

  // Convert dd/mm/yyyy to date object
  convertToDate(dateString: any) {
    let d = dateString.split("-");
    let newFormat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return newFormat;     
  }

  attachmentUpload(event) {
    this.attachmentFile = event.target.files[0];
    this.attachmentName = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(event.target.files[0])
    );
    console.log(this.attachmentFile.name);
    this.expenseForm.controls.upload.setValue(this.attachmentFile.name);
    // this.expenseForm.value.attachment = this.attachmentFile.name;
    // this.fileName = this.employeesFile.name;
  }

  onSubmit(action: string) {
    if(this.expenseForm.valid) {
      let data = {
        requestId: this.data.id,
        approved: action == 'approve' ? true : false,
        comments: this.expenseForm.value.decisionReason
      }
      console.log(this.data);
      this.hrService.actionExpenseRequest(data).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            if(data.approved) this.notifyService.showSuccess('This expense request has been approved');
            else this.notifyService.showInfo('This expense request has been declined');
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

  updateExpenseRequest() {
    if(this.expenseForm.valid) {
      const formData = new FormData();

      formData.append('expenseTypeId', this.expenseForm.value.expenseType);
      formData.append('expenseDate', this.expenseForm.value.expenseDate);
      formData.append('amount', this.expenseForm.value.amount);
      formData.append('description', this.expenseForm.value.description);
      formData.append('attachment', this.attachmentFile);
      // console.log(data);

      this.hrService.updateExpenseRequest(formData, this.data.id).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('Your expense application has been updated successfully');
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
