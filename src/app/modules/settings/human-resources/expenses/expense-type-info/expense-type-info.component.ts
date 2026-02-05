import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-expense-type-info',
  templateUrl: './expense-type-info.component.html',
  styleUrls: ['./expense-type-info.component.scss']
})
export class ExpenseTypeInfoComponent implements OnInit {

  expenseFieldData: FormFields[];
  expenseTypeForm!: FormGroup;
  apiLoading:boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ExpenseTypeInfoComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.expenseTypeForm = this.fb.group({})

    this.expenseFieldData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.expenseType : this.data.name,
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

    this.expenseFieldData.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.expenseTypeForm.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {
    
  }

  onSubmit() {
    if(this.expenseTypeForm.valid) {
      this.apiLoading = true
      let data = {
        expenseType: this.expenseTypeForm.value.name,
        description: this.expenseTypeForm.value.description
      }
      console.log(this.data);
      if(this.data.modalInfo?.expenseName) {
        this.hrService.updateExpenseType(data, this.data.id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              if(this.data.isExisting) this.notifyService.showSuccess('This expense type has been updated successfully');
              else this.notifyService.showSuccess('This expense type has been created successfully');
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
        this.hrService.createExpenseType(data).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This expense type has been created successfully');
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
