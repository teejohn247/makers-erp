import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-leave-assignment',
  templateUrl: './leave-assignment.component.html',
  styleUrls: ['./leave-assignment.component.scss']
})
export class LeaveAssignmentComponent implements OnInit {

  assignmentFieldData: FormFields[];
  assignmentForm!: FormGroup;
  apiLoading:boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public dialogRef: MatDialogRef<LeaveAssignmentComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    console.log(this.modalData);
    this.assignmentFieldData = [
      {
        controlName: 'leaveTypeId',
        controlType: 'select',
        controlLabel: 'Absence Type',
        controlWidth: '100%',
        initialValue: this.modalData.leaveType ? this.modalData.leaveType : null,
        selectOptions: this.arrayToObject(this.modalData.leaveTypes, 'leaveName'),
        validators: null,
        order: 1
      },
      {
        controlName: 'assignedNoOfDays',
        controlType: 'number',
        controlLabel: 'Assigned Days',
        controlWidth: '100%',
        initialValue: this.modalData.leaveDays ? this.modalData.leaveDays : null,
        validators: null,
        order: 2
      },
    ]

    this.assignmentForm = new FormGroup({});
    this.assignmentFieldData.forEach(field => {
      const formControl = new FormControl(field.initialValue, field.validators)
      this.assignmentForm.addControl(field.controlName, formControl)
    });

    // console.log(this.assignmentForm.value)
    // this.assignmentForm.valueChanges.subscribe(res => console.log(res))
  }

  //Converts an array to an Object of key value pairs
  arrayToObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    //console.log(reqObj);
    return reqObj;
  }

  assignmentAction() {
    if(this.assignmentForm.valid) {
      this.apiLoading = true
      let payload = {
        employeeId: this.modalData.employeeId,
        leaveTypeId: this.assignmentForm.value.leaveTypeId,
        assignedNoOfDays: this.assignmentForm.value.assignedNoOfDays
      }
      // console.log(payload)

      this.hrService.assignLeaveDays(payload).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('This leave days assignment was successful');
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

  }

}
