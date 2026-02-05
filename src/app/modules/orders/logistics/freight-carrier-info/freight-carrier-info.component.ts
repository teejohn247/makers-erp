import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FormFields } from 'src/app/shared/models/form-fields';
import { Countries } from 'src/app/core/constants/country-list';

@Component({
  selector: 'app-freight-carrier-info',
  templateUrl: './freight-carrier-info.component.html',
  styleUrls: ['./freight-carrier-info.component.scss']
})
export class FreightCarrierInfoComponent implements OnInit {

  carrierInfoForm!: FormGroup;
  carrierInfoFields: FormFields[];

  imgFile: File;
  imgFileName: string;
  imgPic: string | SafeUrl;
  imgUploadError:string;

  apiLoading:boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<FreightCarrierInfoComponent>,
    private ordersService: OrdersService,
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.carrierInfoForm = this.fb.group({})
    this.setUpForm();
  }

  setUpForm = async () => {
    this.carrierInfoFields = [
      {
        controlName: 'carrierName',
        controlType: 'text',
        controlLabel: 'Freight Carrier Name',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'freightTypes',
        controlType: 'mutipleSelect',
        controlLabel: 'Freight Types',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: {
          Air: 'Air',
          Land: 'Land',
          Sea: 'Sea'
        },
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'email',
        controlType: 'text',
        controlLabel: 'Email Address',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required, Validators.email],
        order: 3
      },
      {
        controlName: 'phone',
        controlType: 'text',
        controlLabel: 'Phone Number',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'address',
        controlType: 'text',
        controlLabel: 'Shipping Address',
        controlWidth: '100%',
        initialValue: '',
        validators: [],
        order: 7
      },
      {
        controlName: 'state',
        controlType: 'text',
        controlLabel: 'State',
        controlWidth: '48%',
        initialValue: '',
        validators: [],
        order: 8
      },
      {
        controlName: 'city',
        controlType: 'text',
        controlLabel: 'City',
        controlWidth: '48%',
        initialValue: '',
        validators: [],
        order: 9
      },
      {
        controlName: 'country',
        controlType: 'select',
        controlLabel: 'Country',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.createCountryOptions(),
        validators: [],
        order: 10
      },
      {
        controlName: 'zipCode',
        controlType: 'text',
        controlLabel: 'Zip Code',
        controlWidth: '48%',
        initialValue: '',
        validators: [],
        order: 11
      },
      {
        controlName: 'logoUpload',
        controlType: 'file',
        controlLabel: '',
        controlWidth: '100%',
        initialValue: null,
        validators: [],
        order: 12
      },
    ]

    this.carrierInfoFields.sort((a,b) => (a.order - b.order));

    this.carrierInfoFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.carrierInfoForm.addControl(field.controlName, formControl)
    });
  }

  onSubmit() {
    this.apiLoading = true
    if(this.carrierInfoForm.valid) {
      const formData = new FormData();

      formData.append('logo', this.imgFile);
      formData.append('freightName', this.carrierInfoForm.value.carrierName);
      formData.append('freightType', JSON.stringify(this.carrierInfoForm.value.freightTypes));
      formData.append('email', this.carrierInfoForm.value.email);
      formData.append('phone', this.carrierInfoForm.value.phone);
      let address = {
        street: this.carrierInfoForm.value.address,
        city: this.carrierInfoForm.value.city,
        state: this.carrierInfoForm.value.state,
        country: this.carrierInfoForm.value.country,
        zipCode: this.carrierInfoForm.value.zipCode
      }
      formData.append('address', JSON.stringify(address));

      this.ordersService.createCourier(formData).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('This freight carrier has been created successfully');
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
    else {
      this.notifyService.showError('Please check that all fields have been filled in')
    }
  }

  closeDialog() {
    this.dialogRef.close();
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

  carrierLogoUpload(event) {
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

  removeFreightType(freightType: string) {
    const selectedFreightTypes = this.carrierInfoForm.value['freightTypes'] as string[];
    this.removeFirst(selectedFreightTypes, freightType);
    this.carrierInfoForm.get['freightTypes'].setValue(selectedFreightTypes); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

}
