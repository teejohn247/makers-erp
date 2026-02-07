import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-branch-info',
  templateUrl: './branch-info.component.html',
  styleUrls: ['./branch-info.component.scss']
})
export class BranchInfoComponent implements OnInit {

  branchFieldData: FormFields[];
  branchForm!: FormGroup;
  employees: any[] = [];
  apiLoading:boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BranchInfoComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.employees = this.data.staff;

    console.log(data);
    this.branchForm = this.fb.group({});

    this.branchFieldData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.branchName : this.data.name,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'branchManager',
        controlType: 'select',
        controlLabel: 'Manager',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.branchManagerId : null,
        selectOptions: this.arrayToObject(this.employees, 'fullName'),
        validators: null,
        order: 2
      },
      {
        controlName: 'branchAdmin',
        controlType: 'select',
        controlLabel: 'Branch Admin',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.branchAdminId : null,
        selectOptions: this.arrayToObject(this.employees, 'fullName'),
        validators: null,
        order: 3
      },
      {
        controlName: 'city',
        controlType: 'text',
        controlLabel: 'Location',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.city : this.data.name,
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'address',
        controlType: 'text',
        controlLabel: 'Address',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.branchAddress : this.data.name,
        validators: [Validators.required],
        order: 5
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

    this.branchFieldData.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.branchForm.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.branchForm.valid) {
      this.apiLoading = true
      let data = {
        departmentName: this.branchForm.value.name,
        managerId: this.branchForm.value.manager
      }
      console.log(this.data);
      if(this.data.modalInfo?.branchName) {
        this.hrService.updateBranch(data, this.data.id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              if(this.data.isExisting) this.notifyService.showSuccess('This branch has been updated successfully');
              else this.notifyService.showSuccess('This branch has been created successfully');
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
        this.hrService.createBranch(data).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This branch has been created successfully');
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

}
