import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-payroll-upload',
  templateUrl: './payroll-upload.component.html',
  styleUrls: ['./payroll-upload.component.scss']
})
export class PayrollUploadComponent implements OnInit {

  fileName: string;
  payrollFile: File;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<PayrollUploadComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
  }

  payrollFileUpload(event) {
    this.payrollFile = event.target.files[0];
    this.fileName = this.payrollFile.name;
  }

  uploadPayrollFile() {
    // this.dataLoading = true;
    //this.employeesFile = uploadedFile.name;
    const formData = new FormData();
    formData.append("file", this.payrollFile);

    // console.log(formData.getAll('file'));
    this.hrService.payrollFileUpload(formData).subscribe({
      next:(res) => {
        this.notifyService.showSuccess('The payroll file has been uploaded successfully');
        this.dialogRef.close();
      },
      error: (err) => {
        console.log(err)
      } 
      
    })
  }

}
