import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-leave-review',
  templateUrl: './leave-review.component.html',
  styleUrls: ['./leave-review.component.scss']
})
export class LeaveReviewComponent implements OnInit {

  leaveRequestFields: FormFields[];
  leaveForm!: FormGroup;
  minDate:Date =  new Date();
  approving:boolean = false;
  declining: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<LeaveReviewComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    
  }

  ngOnInit(): void {
    this.leaveForm = this.fb.group({})
    console.log(this.data);

    this.leaveRequestFields = [
      {
        controlName: 'leaveType',
        controlType: 'select',
        controlLabel: 'Absence Type',
        controlWidth: '100%',
        readonly: this.data.forApproval,
        initialValue: this.data.modalInfo ? this.data.modalInfo.leaveTypeId : null,
        selectOptions: {},
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'startDate',
        controlType: 'date',
        controlLabel: 'Start Date',
        controlWidth: '48%',
        readonly: this.data.forApproval,
        initialValue: this.data.modalInfo ? this.strToDate(this.data.modalInfo.leaveStartDate) : null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'endDate',
        controlType: 'date',
        controlLabel: 'End Date',
        controlWidth: '48%',
        readonly: this.data.forApproval,
        initialValue: this.data.modalInfo ? this.strToDate(this.data.modalInfo.leaveEndDate) : null,
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'message',
        controlType: 'textarea',
        controlLabel: 'Message',
        controlWidth: '100%',
        readonly: this.data.forApproval,
        initialValue: this.data.modalInfo ? this.data.modalInfo.requestMessage : null,
        validators: [Validators.required],
        order: 4
      },
    ]

    if(this.data.forApproval) {
      this.leaveRequestFields.push({
        controlName: 'decisionReason',
        controlType: 'textarea',
        controlLabel: 'Reason for decision',
        controlWidth: '100%',
        readonly: false,
        initialValue: this.data.modalInfo.decisionMessage,
        validators: null,
        order: 6
      })
    }

    this.leaveRequestFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.leaveForm.addControl(field.controlName, formControl)
    })

    this.hrService.getLeaveTypes().subscribe((res:any) => {
      console.log('Leave Types', res)
      this.leaveRequestFields.find(x => x.controlName == 'leaveType').selectOptions = this.arrayToObject(res.data, 'leaveName');
      console.log(this.leaveRequestFields)
    }) 
  }

  //Converts an array to an Object of key value pairs
  arrayToObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      if(this.data.forApproval || item.noOfLeaveDays > 0) agg[item['_id']] = item[key]
      else agg[item['_id']] = item[key]
      return agg;
    }, {})
    //console.log(reqObj);
    return reqObj;
  }

  // Convert dd/mm/yyyy to date object
  convertToDate(dateString: any) {
    let d = dateString.split("-");
    let newFormat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return newFormat;     
  }

  onSubmit(action: string) {
    if(this.leaveForm.valid) {
      if(action == 'approve') this.approving = true
      else if (action == 'decline') this.declining = true
      let data = {
        leaveId: this.data.id,
        approved: action == 'approve' ? true : false,
        // description: this.leaveForm.value.decisionReason
      }
      console.log(this.data);
      this.hrService.actionLeaveRequest(data).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            if(data.approved) this.notifyService.showSuccess('This leave request has been approved');
            else this.notifyService.showInfo('This leave request has been declined');
            this.dialogRef.close();
            this.approving = false;
            this.declining = false;
          }
          //this.getPageData();
        },
        error: err => {
          console.log(err)
          this.approving = false;
          this.declining = false;
          this.notifyService.showError(err.error.error);
        } 
      })
    }
  }

  createLeaveRequest() {
    if(this.leaveForm.valid) {
      let data = {
        leaveTypeId: this.leaveForm.value.leaveType,
        leaveStartDate: this.leaveForm.value.startDate,
        leaveEndDate: this.leaveForm.value.endDate,
        requestMessage: this.leaveForm.value.message
      }
      console.log(data);
      this.hrService.createLeaveRequest(data).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('You leave application has been sent successfully');
            //this.getPageData();
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }
  }

  updateLeaveRequest() {
    if(this.leaveForm.valid) {
      let data = {
        leaveTypeId: this.leaveForm.value.leaveType,
        leaveStartDate: this.leaveForm.value.startDate,
        leaveEndDate: this.leaveForm.value.endDate,
        requestMessage: this.leaveForm.value.message
      }
      console.log(data);
      this.hrService.updateLeaveRequest(data, this.data.id).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('Your leave application has been updated successfully');
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

  strToDate(dateVal: string) {
    let reqDate:any = new Date(dateVal)
    if(reqDate == 'Invalid Date') {
      const [day, month, year] = dateVal.split('-');
      let newFormat = new Date(+year, +month - 1, +day);
      reqDate = newFormat;
    }
    return reqDate;
  }


}
