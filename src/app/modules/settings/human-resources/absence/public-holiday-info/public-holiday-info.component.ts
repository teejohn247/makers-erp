import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-public-holiday-info',
  templateUrl: './public-holiday-info.component.html',
  styleUrls: ['./public-holiday-info.component.scss']
})

export class PublicHolidayInfoComponent implements OnInit {

  holidayData: FormFields[];
  holidayForm!: FormGroup;
  apiLoading:boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PublicHolidayInfoComponent>,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) {
    this.holidayForm = this.fb.group({})

    console.log(data);

    this.holidayData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '48%',
        initialValue: this.data.name ? this.data.name : null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'date',
        controlType: 'date',
        controlLabel: 'Date',
        controlWidth: '48%',
        initialValue: this.data.isExisting && this.data.modalInfo ? this.data.modalInfo.date : null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'description',
        controlType: 'text',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting && this.data.modalInfo ? this.data.modalInfo.description : null,
        validators: null,
        order: 3
      }
    ]

    this.holidayData.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.holidayForm.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.holidayForm.valid) {
      this.apiLoading = true
      let data = {
        holidayName: this.holidayForm.value.name,
        description: this.holidayForm.value.description,
        date: this.holidayForm.value.date,
      }
      console.log(data);
      if(this.data.isExisting) {
        this.hrService.updatePublicHoliday(data, this.data.id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              if(this.data.isExisting) this.notifyService.showSuccess('This public holiday has been updated successfully');
              else this.notifyService.showSuccess('This public holiday has been created successfully');
              this.dialogRef.close();
            }
            this.apiLoading = false
            //this.getPageData();
          },
          error: err => {
            console.log(err)
            this.apiLoading = false;
            this.notifyService.showError(err.error.error);
          } 
        })
      }
      else {
        this.hrService.createPublicHoliday(data).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This public holiday has been created successfully');
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
