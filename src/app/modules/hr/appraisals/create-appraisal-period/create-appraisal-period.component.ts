import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-create-appraisal-period',
  templateUrl: './create-appraisal-period.component.html',
  styleUrls: ['./create-appraisal-period.component.scss']
})
export class CreateAppraisalPeriodComponent implements OnInit {

  appraisalPeriodData: FormFields[];
  appraisalPeriodForm!: FormGroup;
  apiLoading:boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<CreateAppraisalPeriodComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.appraisalPeriodForm = this.fb.group({})

    this.appraisalPeriodData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.appraisalPeriodName : this.data.name,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'description',
        controlType: 'text',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.description : null,
        validators: null,
        order: 2
      },
      {
        controlName: 'startDate',
        controlType: 'date',
        controlLabel: 'Start Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.startDate : null,
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'endDate',
        controlType: 'date',
        controlLabel: 'End Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.endDate : null,
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'activeDate',
        controlType: 'date',
        controlLabel: 'Active Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.activeDate : null,
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'inactiveDate',
        controlType: 'date',
        controlLabel: 'Inactive Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting ? this.data.modalInfo.inactiveDate : null,
        validators: [Validators.required],
        order: 6
      }
    ]

    this.appraisalPeriodData.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.appraisalPeriodForm.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.appraisalPeriodForm.valid) {
      this.apiLoading = true;
      let data = {
        name: this.appraisalPeriodForm.value.name,
        description: this.appraisalPeriodForm.value.description,
        startDate: this.appraisalPeriodForm.value.startDate,
        endDate: this.appraisalPeriodForm.value.endDate,
        activeDate: this.appraisalPeriodForm.value.startDate,
        inactiveDate: this.appraisalPeriodForm.value.endDate
      }
      console.log(data);
      if(this.data.modalInfo?.name) {
        this.hrService.updateAppraisalPeriod(data, this.data.id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This appraisal period has been updated successfully');
              this.apiLoading = false;
              this.dialogRef.close();
            }
            //this.getPageData();
          },
          error: err => {
            console.log(err);
            this.apiLoading = false;
            this.notifyService.showError(err.error.error);
          } 
        })
      }
      else {
        this.hrService.createAppraisalPeriod(data).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('The appraisal period has been created successfully');
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

}
