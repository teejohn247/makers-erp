import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-designation-info',
  templateUrl: './designation-info.component.html',
  styleUrls: ['./designation-info.component.scss']
})
export class DesignationInfoComponent implements OnInit {

  designationFieldData: FormFields[];
  designationForm!: FormGroup;
  leaveTypeList: any[] = [];
  apiLoading:boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<DesignationInfoComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.designationForm = this.fb.group({})
    this.leaveTypeList = this.data.leaveTypes;
    console.log(data);
    //this.getLeaveTypes();
  }

  ngOnInit(): void {
    this.designationFieldData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.designationName : this.data.name,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'grade',
        controlType: 'number',
        controlLabel: 'Grade',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.grade : null,
        validators: null,
        order: 2
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.description : null,
        validators: null,
        order: 3
      },
      {
        controlName: 'expenseCardDuration',
        controlType: 'date',
        controlLabel: 'Expense Card Expiry Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.expenseCard[0]?.cardExpiryDate : null,
        validators: null,
        order: 4
      },
      {
        controlName: 'expenseCardLimit',
        controlType: 'number',
        controlLabel: 'Expense Card Limit (NGN)',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.expenseCard[0]?.cardLimit : null,
        validators: null,
        order: 5
      }
    ]

    this.data.isExisting ?
    this.data.modalInfo.leaveTypes.forEach(leave => {
      this.designationFieldData.push(
        {
          controlName: leave.leaveName,
          controlType: 'number',
          controlLabel: leave.leaveName + ' Leave (Days)',
          controlWidth: '48%',
          initialValue: leave.noOfLeaveDays,
          validators: null,
          order: this.leaveTypeList.indexOf(leave) + 6
        }
      )
    })
    :
    this.leaveTypeList.forEach(leave => {
      this.designationFieldData.push(
        {
          controlName: leave.leaveName,
          controlType: 'number',
          controlLabel: leave.leaveName + ' Leave (Days)',
          controlWidth: '48%',
          initialValue: null,
          validators: null,
          order: this.leaveTypeList.indexOf(leave) + 6
        }
      )
    });
    console.log(this.designationFieldData);
    this.designationFieldData.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.designationForm.addControl(field.controlName, formControl)
    })
  }

  // getLeaveTypes = async () => {
  //   this.hrService.getLeaveTypes().subscribe({
  //     next: res => {
  //       console.log(res);
  //       if(res.status == 200) {
  //         this.leaveTypeList = res.data;
          
  //       }
  //     },
  //     error: err => {
  //       console.log(err);
  //     }
  //   });
  // }

  onSubmit() {
    if(this.designationForm.valid) {
      this.apiLoading = true;
      let data = {
        designationName: this.designationForm.value.name,
        description: this.designationForm.value.description,
        grade: this.designationForm.value.grade,
        leaveAssignment: this.leaveTypeList.map(item => {
          let assignedVal = {
            leaveTypeId: item._id,
            noOfLeaveDays: this.designationForm.value[item.leaveName].toString()
          }
          return assignedVal;
        }),
        expenseCard: [{
          cardCurrency: "NGN",
          cardExpiryDate: this.designationForm.value.expenseCardDuration,
          cardLimit: this.designationForm.value.expenseCardLimit,
        }]
      }
      console.log(this.data);
      if(this.data.modalInfo?.designationName) {
        this.hrService.updateDesignation(data, this.data.id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              if(this.data.isExisting) this.notifyService.showSuccess('This designation has been updated successfully');
              else this.notifyService.showSuccess('This designation has been created successfully');
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
        this.hrService.createDesignation(data).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This designation has been created successfully');
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
    }
  }
}
