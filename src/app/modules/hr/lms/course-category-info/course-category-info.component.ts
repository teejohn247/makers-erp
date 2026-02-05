import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-course-category-info',
  templateUrl: './course-category-info.component.html',
  styleUrls: ['./course-category-info.component.scss']
})
export class CourseCategoryInfoComponent implements OnInit {

  categoryFields: FormFields[];
  categoryForm!: FormGroup;
  apiLoading:boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(HumanResourcesService) private hrService: HumanResourcesService,
    public dialogRef: MatDialogRef<CourseCategoryInfoComponent>,
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({})

    this.categoryFields = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.kpiName : '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.kpiDescription : null,
        validators: null,
        order: 2
      }
    ]

    this.categoryFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.categoryForm.addControl(field.controlName, formControl)
    })
  }

  onSubmit() {
    if(this.categoryForm.valid) {
      this.apiLoading = true;
      let payload = {
        name: this.categoryForm.value.name,
        description: this.categoryForm.value.description,
        isActive: true
      }
      console.log(this.data);
      this.hrService.createCourseCategory(payload).subscribe({
        next: res => {
          console.log(res);
          if(res.success) {
            this.notifyService.showSuccess('This category has been created successfully');
            this.apiLoading = false;
            this.dialogRef.close({data: res.data});
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
  }

}
