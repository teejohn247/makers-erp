import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-assign-salary-scales',
  templateUrl: './assign-salary-scales.component.html',
  styleUrls: ['./assign-salary-scales.component.scss']
})
export class AssignSalaryScalesComponent implements OnInit {

  assignmentFieldData: FormFields[];
  assignmentForm!: FormGroup;
  salaryScales: any[] = [];
  selections: any[] = [];
  apiLoading:boolean = false;
  scaleLevelOptions:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssignSalaryScalesComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.salaryScales = this.data.salaryScales;
    this.selections = this.removeDuplicates(this.data.selections);

    console.log(this.data.salaryScales);

    this.assignmentFieldData = [
      {
        controlName: 'salaryScale',
        controlType: 'select',
        controlLabel: 'Salary Scale',
        controlWidth: '100%',
        initialValue: null,
        selectOptions: this.arrayToObject(this.data.salaryScales, 'name'),
        validators: null,
        order: 1
      },
      {
        controlName: 'scaleLevel',
        controlType: 'select',
        controlLabel: 'Salary Scale Level',
        controlWidth: '100%',
        initialValue: '',
        selectOptions: this.scaleLevelOptions,
        validators: null,
        order: 2
      },
    ]

    this.assignmentForm = new FormGroup({});
    this.assignmentFieldData.forEach(field => {
      const formControl = new FormControl(field.initialValue, field.validators)
      this.assignmentForm.addControl(field.controlName, formControl)
    });

    this.assignmentForm.controls['salaryScale'].valueChanges.subscribe(val => {
      let selectedScaleLevels = this.salaryScales.find(x => x._id == val).salaryScaleLevels
      this.assignmentFieldData[1].selectOptions = this.arrayToObject(selectedScaleLevels, 'levelName');
      if(selectedScaleLevels.length == 1) this.assignmentForm.controls['scaleLevel'].setValue(selectedScaleLevels[0]._id)
    })
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
        employeeIds: this.data.selections.map(item => item._id),
        salaryScaleId: this.assignmentForm.value.salaryScale,
        salaryLevelId: this.assignmentForm.value.scaleLevel
      }

      this.hrService.assignSalaryScale(payload).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('This salary scale assignment was successful');
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

  removeDuplicates(arrVal:any[]) {
    return arrVal.filter((obj1, i, arr) => 
      arr.findIndex(obj2 => (obj2._id === obj1._id)) === i
    )
  }
}
