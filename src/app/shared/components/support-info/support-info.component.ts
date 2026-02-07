import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormFields } from '@shared/models/form-fields';
import { HumanResourcesService } from '@services/hr/human-resources.service';
import { NotificationService } from '@services/utils/notification.service';
import { SettingsService } from '@services/settings/settings.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-support-info',
  templateUrl: './support-info.component.html',
  styleUrls: ['./support-info.component.scss']
})
export class SupportInfoComponent implements OnInit {

  fieldData: FormFields[];
  form!: FormGroup;
  apiLoading:boolean = false;
  categoryOptions = {
    Login: "Login",
    Access: "Access",
    "Absence Management": "Absence Mnaagement",
    "Expense Management": "Expense Mnaagement",
    Payroll: "Payroll",
    Appraisal: "Appraisal",
    LMS: "LMS",
    Calendar: "Calendar",
    General: "General",
    Settings: "Settings",
    Other: "Other"
  }

  imgFile: File;
  imgFileName: string;
  imgPic: string | SafeUrl;
  imgUploadError:string;

  constructor(
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SupportInfoComponent>,
    private settingsService: SettingsService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    console.log(data);
    this.form = this.fb.group({});

    this.fieldData = [
      {
        controlName: 'issueCategory',
        controlType: 'select',
        controlLabel: 'Category',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.issueCategory : null,
        selectOptions: this.categoryOptions,
        validators: null,
        order: 1
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.branchName : this.data.name,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'imgFile',
        controlType: 'file',
        controlLabel: '',
        controlWidth: '100%',
        initialValue: null,
        validators: [],
        order: 16
      },
    ]

    this.fieldData.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.form.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.form.valid) {
      this.apiLoading = true;

      const formData = new FormData();
      formData.append('description', this.form.value.description);
      formData.append('issueCategory', this.form.value.issueCategory);
      formData.append('screenshots', this.imgFile);

      console.log(this.data);
      if(this.data.modalInfo) {
        console.log(this.data.modalInfo)
      }
      else {
        this.settingsService.sendComplaint(formData).subscribe({
          next: res => {
            // console.log(res);
            if(res.ssuccess) {
              this.notifyService.showSuccess('Your complaint was sent successfully');
              this.apiLoading = false;
              this.dialogRef.close();
            }
            //this.getPageData();
          },
          error: err => {
            this.apiLoading = false;
          } 
        })
      }
    }
  }

  imgFileUpload(event) {
    this.imgFile = event.target.files[0];
    const img = new Image();
    let imgWidth;
    let imgHeight;
    let imgRatio;
    img.src = window.URL.createObjectURL(event.target.files[0]);
    img.onload = () => {
      if (this.imgFile.size > 1000000) {
        this.imgUploadError = 'Please check that your image size is not more than 1MB';
        this.imgFileName = '';
        this.imgFile = null
      }
      else {
        this.imgUploadError = '';
        this.imgFileName = this.imgFile.name;
        this.imgPic = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(this.imgFile)
        );
      }
    }
  }

}
