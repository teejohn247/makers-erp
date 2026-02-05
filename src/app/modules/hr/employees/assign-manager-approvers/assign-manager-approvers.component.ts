import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-assign-manager-approvers',
  templateUrl: './assign-manager-approvers.component.html',
  styleUrls: ['./assign-manager-approvers.component.scss']
})

export class AssignManagerApproversComponent implements OnInit {

  assignmentFieldData: FormFields[];
  assignmentForm!: FormGroup;
  employees: any[] = [];
  selections: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssignManagerApproversComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    
    
  }

  ngOnInit(): void {
    this.employees = this.data.employeeList;
    this.selections = this.removeDuplicates(this.data.selections);
    this.assignmentForm = this.fb.group({});

    console.log(this.data);

    this.assignmentFieldData = [
      {
        controlName: 'approvalType',
        controlType: 'select',
        controlLabel: this.data.assignmentType == 'Manager' ? 'Assignment Type' : 'Approval Assignment Type',
        controlWidth: '100%',
        initialValue: this.data.assignmentType == 'Manager' ? 'Manager' : null,
        selectOptions: this.data.assignmentType != 'Manager' ? 
        {
          Appraisal: 'Appraisal',
          Leave: 'Leave',
          Expense: 'Expense'
        } : 
        {
          Manager: 'Manager'
        },
        readonly: this.data.assignmentType == 'Manager' ? true : false,
        validators: null,
        order: 1
      },
      {
        controlName: 'manager',
        controlType: 'select',
        controlLabel: this.data.assignmentType == 'Manager' ? 'Select Manager' : 'Select Approver',
        controlWidth: '100%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.employees, 'fullName'),
        validators: null,
        order: 2
      },
      // {
      //   controlName: 'description',
      //   controlType: 'textarea',
      //   controlLabel: 'Description',
      //   controlWidth: '100%',
      //   initialValue: this.data.isExisting ? this.data.modalInfo.description : null,
      //   validators: null,
      //   order: 2
      // }
    ]

    this.assignmentFieldData.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.assignmentForm.addControl(field.controlName, formControl)
    })
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

  assignmentAction() {
    if(this.data.assignmentType == 'Manager' && this.assignmentForm.valid) {
      let data = {
        employees: this.data.selections.map(item => item._id),
        managerId: this.assignmentForm.value.manager
      }
      console.log(data);
      this.hrService.assignManager(data).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('This manager assignment was successfully updated');
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
    else {
      let data = {
        approvalType: this.assignmentForm.value.approvalType.toLowerCase(),
        employees: this.data.selections.map(item => item._id),
        managerId: this.assignmentForm.value.manager
      }

      this.hrService.assignApprover(data).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('This approver assignment was successfully updated');
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

  removeDuplicates(arrVal:any[]) {
    return arrVal.filter((obj1, i, arr) => 
      arr.findIndex(obj2 => (obj2._id === obj1._id)) === i
    )
  }
}
