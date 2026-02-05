import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {

  categoryFields: FormFields[];
  categoryForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProductCategoryComponent>,
    private ordersService: OrdersService,
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
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

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.categoryForm.valid) {
      let payload = {
        name: this.categoryForm.value.name,
        description: this.categoryForm.value.description,
      }
      console.log(this.data);
      this.ordersService.createProductCategory(payload).subscribe({
        next: res => {
          console.log(res);
          if(res.success) {
            this.notifyService.showSuccess('This category has been created successfully');
            this.dialogRef.close({data: res.data});
          }
          //this.getPageData();
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }
  }

}
