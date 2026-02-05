import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FormFields } from 'src/app/shared/models/form-fields';
import { Countries } from 'src/app/core/constants/country-list';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent implements OnInit {

  customerInfoForm!: FormGroup;
  customerInfoFields: FormFields[];

  industriesList:any[] = [];

  apiLoading:boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<CustomerInfoComponent>,
    private ordersService: OrdersService,
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.customerInfoForm = this.fb.group({})
  }

  ngOnInit(): void {
    this.industriesList = this.dialogData.industries;
    // console.log(this.industriesList)
    this.setUpForm();

    this.customerInfoForm.controls['customerType'].valueChanges.subscribe(val => {
      if(val == 'Company') {
        this.customerInfoForm.controls['firstName'].disable();
        this.customerInfoForm.controls['lastName'].disable();
        this.customerInfoForm.controls['companyName'].setValidators([Validators.required]);
        this.customerInfoForm.controls['companyName'].updateValueAndValidity();
      }
      else {
        this.customerInfoForm.controls['firstName'].enable();
        this.customerInfoForm.controls['lastName'].enable();
        this.customerInfoForm.controls['companyName'].setValidators([]);
        this.customerInfoForm.controls['companyName'].updateValueAndValidity();
      }
    })
  }

  setUpForm = async () => {
    this.customerInfoFields = [
      {
        controlName: 'customerType',
        controlType: 'select',
        controlLabel: 'Customer Type',
        controlWidth: '100%',
        initialValue: this.dialogData.isExisting ? this.dialogData.customerDetails.customerType : '',
        selectOptions: {
          Individual: 'Individual',
          Company: 'Company'
        },
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'firstName',
        controlType: 'text',
        controlLabel: 'First Name',
        controlWidth: '48%',
        initialValue: this.dialogData.isExisting ? this.dialogData.customerDetails.firstName : null,
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'lastName',
        controlType: 'text',
        controlLabel: 'Last Name',
        controlWidth: '48%',
        initialValue: this.dialogData.isExisting ? this.dialogData.customerDetails.lastName : null,
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'companyName',
        controlType: 'text',
        controlLabel: 'Company Name',
        controlWidth: '48%',
        initialValue: this.dialogData.isExisting ? this.dialogData.customerDetails.companyName : null,
        validators: [],
        order: 4
      },
      {
        controlName: 'industry',
        controlType: 'select',
        controlLabel: 'Industry',
        controlWidth: '48%',
        initialValue: this.dialogData.isExisting ? this.dialogData.customerDetails.industry._id : '',
        selectOptions: this.arrayToObject(this.industriesList, 'industryName'),
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'email',
        controlType: 'text',
        controlLabel: 'Email Address',
        controlWidth: '48%',
        initialValue: this.dialogData.isExisting ? this.dialogData.customerDetails.email : null,
        validators: [Validators.required, Validators.email],
        order: 6
      },
      {
        controlName: 'phoneNo',
        controlType: 'text',
        controlLabel: 'Phone Number',
        controlWidth: '48%',
        initialValue: this.dialogData.isExisting ? this.dialogData.customerDetails.phone : null,
        validators: [Validators.required],
        order: 7
      },
      
      {
        controlName: 'address',
        controlType: 'text',
        controlLabel: 'Shipping Address',
        controlWidth: '100%',
        initialValue: this.dialogData.isExisting ? this.dialogData.customerDetails.shippingAddress.street : null,
        validators: [],
        order: 8
      },
      {
        controlName: 'state',
        controlType: 'text',
        controlLabel: 'State',
        controlWidth: '48%',
        initialValue: this.dialogData.isExisting ? this.dialogData.customerDetails.shippingAddress.state : null,
        validators: [],
        order: 9
      },
      {
        controlName: 'city',
        controlType: 'text',
        controlLabel: 'City',
        controlWidth: '48%',
        initialValue: this.dialogData.isExisting ? this.dialogData.customerDetails.shippingAddress.city : null,
        validators: [],
        order: 10
      },
      {
        controlName: 'country',
        controlType: 'select',
        controlLabel: 'Country',
        controlWidth: '48%',
        initialValue: this.dialogData.isExisting ? this.dialogData.customerDetails.shippingAddress.country : null,
        selectOptions: this.createCountryOptions(),
        validators: [],
        order: 11
      },
      {
        controlName: 'zipCode',
        controlType: 'text',
        controlLabel: 'Zip Code',
        controlWidth: '48%',
        initialValue: this.dialogData.isExisting ? this.dialogData.customerDetails.shippingAddress.zipCode : null,
        validators: [],
        order: 12
      },
    ]

    this.customerInfoFields.sort((a,b) => (a.order - b.order));

    this.customerInfoFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.customerInfoForm.addControl(field.controlName, formControl)
    });
  }

  onSubmit() {
    this.apiLoading = true
    if(this.customerInfoForm.valid) {
      let payload = {
        customerType: this.customerInfoForm.value.customerType,
        firstName: this.customerInfoForm.value.firstName,
        lastName: this.customerInfoForm.value.lastName,
        email: this.customerInfoForm.value.email,
        phone: this.customerInfoForm.value.phoneNo,
        companyName: this.customerInfoForm.value.companyName,
        industry: this.customerInfoForm.value.industry,
        shippingAddress: {
          street: this.customerInfoForm.value.address,
          city: this.customerInfoForm.value.city,
          state: this.customerInfoForm.value.state,
          country: this.customerInfoForm.value.country,
          zipCode: this.customerInfoForm.value.zipCode
        }
      }
      // console.log(data);
      this.ordersService.createCustomer(payload).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('This customer has been created successfully');
            this.apiLoading = false
            this.dialogRef.close();
          }
        },
        error: err => {
          console.log(err)
          this.apiLoading = false
          //this.notifyService.showError(err.error.error);
        } 
      })
    }
  }

  closeDialog() {
    this.dialogRef.close();
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

  createCountryOptions() {
    let reqObj = {}
    reqObj = Countries.reduce((agg, item, index) => {
      agg[item['label']] = item['label'];
      return agg;
    }, {})
    //console.log(reqObj);
    return reqObj;
  }

}
