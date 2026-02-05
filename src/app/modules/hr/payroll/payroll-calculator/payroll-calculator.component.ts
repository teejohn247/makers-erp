import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-payroll-calculator',
  templateUrl: './payroll-calculator.component.html',
  styleUrls: ['./payroll-calculator.component.scss']
})
export class PayrollCalculatorComponent implements OnInit {

  payrollCalculatorForm!: FormGroup;
  payrollCalculatorFields: any[] = [];

  payrollCredits: any[] = [];
  payrollDebits: any[] = [];

  fieldsCount: number;

  totalEarnings: number = 0;
  deductions: number = 0;
  netEarnings: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<PayrollCalculatorComponent>,
    private hrService: HumanResourcesService,
    private authService: AuthenticationService,     
    private notifyService: NotificationService,
    private fb: FormBuilder

  ) {
    console.log(dialogData);
    this.payrollCalculatorForm = this.fb.group({})
    this.setUpForm();
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  setUpForm = async () => {
    this.payrollCredits = this.dialogData.payrollCredits;
    this.payrollDebits = this.dialogData.payrollDebits;

    console.log(this.payrollCredits);

    if(this.payrollCredits) {
      this.fieldsCount = 0;
      this.payrollCredits.map(item => {
        this.fieldsCount = this.fieldsCount + 1;
        this.totalEarnings = this.totalEarnings + this.dialogData.modalInfo.dynamicFields[this.toCamelCase(item.name)];
        let fieldObject = {
          controlName: this.toCamelCase(item.name),
          controlType: 'credit',
          controlLabel: item.name,
          controlWidth: '48%',
          readonly: this.dialogData.modalInfo.status == 'Completed',
          initialValue: this.dialogData.modalInfo.dynamicFields[this.toCamelCase(item.name)],
          validators: [Validators.required],
          order: this.fieldsCount,
        }
        this.payrollCalculatorFields.push(fieldObject);
      })
    }

    if(this.payrollDebits) {
      this.payrollDebits.map(item => {
        this.fieldsCount = this.fieldsCount + 1;
        this.deductions = this.deductions + this.dialogData.modalInfo.dynamicFields[this.toCamelCase(item.name)];
        let fieldObject = {
          controlName: this.toCamelCase(item.name),
          controlType: 'debit',
          controlLabel: item.name,
          controlWidth: '48%',
          readonly: this.dialogData.modalInfo.status == 'Completed',
          initialValue: this.dialogData.modalInfo.dynamicFields[this.toCamelCase(item.name)],
          validators: [Validators.required],
          order: this.fieldsCount,
        }
        this.payrollCalculatorFields.push(fieldObject);
      })
    }

    this.netEarnings = this.totalEarnings - this.deductions;

    console.log(this.payrollCalculatorFields);
    this.payrollCalculatorFields.sort((a,b) => (a.order - b.order));

    this.payrollCalculatorFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.payrollCalculatorForm.addControl(field.controlName, formControl)
    });
  }

  //Convert string to camel case
  toCamelCase(str:string){
    return str.split(' ').map(function(word,index){
      // If it is the first word make sure to lowercase all the chars.
      if(index == 0){
        return word.toLowerCase();
      }
      // If it is not the first word only upper case the first char and lowercase the rest.
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
  }

  payCalculation(earningType: string, controlName: string) {
    // console.log( earningType + ':' + this.payrollCalculatorForm.value[controlName])
    if(earningType == 'credit') {
      let creditSum = 0;
      this.payrollCredits.map(val => {
        console.log(val);
        creditSum = creditSum + this.payrollCalculatorForm.value[this.toCamelCase(val.name)];
      })
      this.totalEarnings = creditSum;
      this.netEarnings = this.totalEarnings - this.deductions;
    }
    else {
      let debitSum = 0;
      this.payrollDebits.map(val => {
        debitSum = debitSum + this.payrollCalculatorForm.value[this.toCamelCase(val.name)];
      })
      this.deductions = debitSum;
      this.netEarnings = this.totalEarnings - this.deductions;
    }
  }

  onSubmit() {
    console.log(this.payrollCalculatorForm.controls);
    let dynamicFields = {};
    Object.keys(this.payrollCalculatorForm.controls).forEach((key: string) => {
      dynamicFields[key] = this.payrollCalculatorForm.value[key];
    });
    console.log(dynamicFields);
    if(this.payrollCalculatorForm.valid) {
      let data = {
        dynamicFields: dynamicFields,
        totalEarnings: this.totalEarnings,
        deductions: this.deductions,
        netEarnings: this.netEarnings,
      }
      console.log(data);
      this.hrService.updatePayrollEntry(data, this.dialogData.modalInfo._id).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('This payroll entry has been updated successfully');
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
