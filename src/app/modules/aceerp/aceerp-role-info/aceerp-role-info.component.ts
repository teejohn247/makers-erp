import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { AceerpService } from 'src/app/shared/services/aceerp/aceerp.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-aceerp-role-info',
  templateUrl: './aceerp-role-info.component.html',
  styleUrls: ['./aceerp-role-info.component.scss']
})
export class AceerpRoleInfoComponent implements OnInit {

  roleInfoFields: FormFields[];
  roleInfoGroupForm!: FormGroup;
  moduleList: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AceerpRoleInfoComponent>,
    private aceerpService: AceerpService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.moduleList = this.data.moduleList;
    console.log(this.moduleList);
    this.roleInfoGroupForm = this.fb.group({})

    this.roleInfoFields = [
      {
        controlName: 'roleName',
        controlType: 'text',
        controlLabel: 'Role Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.roleName : null,
        validators: null,
        order: 1
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
        controlName: 'moduleIds',
        controlType: 'mutipleSelect',
        controlLabel: 'Modules',
        controlWidth: '100%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.moduleList, 'moduleName'),
        validators: [Validators.required],
        order: 2
      },
    ]

    this.roleInfoFields.sort((a,b) => (a.order - b.order));

    this.roleInfoFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.roleInfoGroupForm.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {
  }

  removeModule(name: string) {
    const selectedModules = this.roleInfoGroupForm.value['moduleIds'] as string[];
    this.removeFirst(selectedModules, name);
    this.roleInfoGroupForm.get['moduleIds'].setValue(selectedModules); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
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

  onSubmit() {
    if(this.roleInfoGroupForm.valid) {
      let data = {
        roleName: this.roleInfoGroupForm.value.roleName,
        description: this.roleInfoGroupForm.value.description,
        modules: this.roleInfoGroupForm.value.moduleIds,
      }
      console.log(data);
      this.aceerpService.activateSubscription(data).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('This subscription was activated successfully');
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
