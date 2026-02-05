import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { AceerpService } from 'src/app/shared/services/aceerp/aceerp.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-aceerp-permission-info',
  templateUrl: './aceerp-permission-info.component.html',
  styleUrls: ['./aceerp-permission-info.component.scss']
})
export class AceerpPermissionInfoComponent implements OnInit {
  apiLoading:boolean = false;
  permissionInfoFields: FormFields[];
  permissionInfoGroupForm!: FormGroup;
  moduleList: any[] = [];
  featuresList:any[] = [];
  featureSelectOptions:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AceerpPermissionInfoComponent>,
    private aceerpService: AceerpService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    
  }

  ngOnInit(): void {
    this.moduleList = this.data.moduleList;
    this.featuresList = this.data.featureList;
    console.log(this.moduleList);
    this.permissionInfoGroupForm = this.fb.group({})

    this.permissionInfoFields = [
      {
        controlName: 'permissionName',
        controlType: 'text',
        controlLabel: 'Permission Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.permissionName : null,
        validators: null,
        order: 1
      },
      {
        controlName: 'permissionKey',
        controlType: 'text',
        controlLabel: 'Permission Key',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.permissionKey : null,
        validators: null,
        order: 2
      }, 
      {
        controlName: 'permissionType',
        controlType: 'select',
        controlLabel: 'Permission Type',
        controlWidth: '48%',
        selectOptions: {
          create: 'Create',
          view: 'View',
          update: 'Update',
          delete: 'Delete'
        },
        initialValue: this.data.isExisting ? this.data.modalInfo.permissionType : null,
        validators: null,
        order: 3
      },      
      {
        controlName: 'moduleId',
        controlType: 'select',
        controlLabel: 'Module',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.moduleList, 'moduleName'),
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'featureId',
        controlType: 'select',
        controlLabel: 'Feature',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.featuresList, 'featureName'),
        validators: [Validators.required],
        order: 5
      },
    ]

    this.permissionInfoFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.permissionInfoGroupForm.addControl(field.controlName, formControl)
    })

    this.permissionInfoGroupForm.controls['moduleId'].valueChanges.subscribe(val => {
      // console.log(val)
      this.featureSelectOptions = this.arrayToObject(this.moduleList.find(module => module._id == val).moduleFeatures, 'featureName')
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

  onSubmit() {
    this.apiLoading = true
    if(this.permissionInfoGroupForm.valid) {
      let data = this.permissionInfoGroupForm.value
      // console.log(data);
      this.aceerpService.createPermission(data).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('This permission has been created successfully');
            this.apiLoading = false
            this.dialogRef.close();
          }
        },
        error: err => {
          console.log(err)
          this.apiLoading = false
          this.notifyService.showError(err.error.error);
        } 
      })
    }
  }

}
