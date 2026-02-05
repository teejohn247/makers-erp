import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {

  fileName: string;
  employeesFile: File;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<BulkUploadComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,

  ) { }

  ngOnInit(): void {
  }

  bulkEmployeeUpload(event) {
    this.employeesFile = event.target.files[0];
    this.fileName = this.employeesFile.name;
  }

  uploadEmployees() {
    // this.dataLoading = true;
    //this.employeesFile = uploadedFile.name;
    const formData = new FormData();
    formData.append("file", this.employeesFile);

    console.log(formData.getAll('file'));
    this.hrService.bulkEmployeeUpload(formData).subscribe({
      next:(res) => {
        this.notifyService.showSuccess('Your request has been sent successfully');
        this.dialogRef.close();
      },
      error: (err) => {
        console.log(err)
      } 
      
    })
  }

}
