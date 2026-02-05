import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FormFields } from 'src/app/shared/models/form-fields';
import { StockInfoComponent } from '../stock-info/stock-info.component';
import { ProductCategoryComponent } from '../product-category/product-category.component';
import { WEIGHT_UNITS, LENGTH_UNITS } from 'src/app/core/constants/general-data';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent implements OnInit {

  productInfoForm!: FormGroup;
  productInfoFields: FormFields[];

  productCategories:any[] = [];
  productCatOptions:any;

  supplierList:any[] = [];

  weightUnits:any[] = WEIGHT_UNITS;
  lengthUnits:any[] = LENGTH_UNITS;

  imgFile: File;
  imgFileName: string;
  imgPic: string | SafeUrl;
  imgUploadError:string;

  apiLoading:boolean = false;
  addCategory:boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private location: Location,
    public dialog: MatDialog,
    // @Inject(MAT_DIALOG_DATA) public dialogData: any,
    // public dialogRef: MatDialogRef<CustomerInfoComponent>,
    @Inject(OrdersService) private ordersService: OrdersService,
    @Inject(NotificationService) private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.productInfoForm = this.fb.group({})
  }

  ngOnInit(): void {
    // console.log(this.industriesList)
    this.getPageData();

    // this.productInfoFields && this.productInfoForm.controls['productCategory'].valueChanges.subscribe(val => {
    //   console.log(val)
    //   if(val == 'other') {
    //     this.addCategory = true;
    //     this.addProductCategory();
    //     this.productInfoForm.controls['productCategory'].setValue('');
    //   }
    //   else {
    //     this.addCategory = false
    //   }
    // })

    this.productInfoForm.valueChanges.subscribe(val => {
      if(this.productInfoForm.value.productCategory == 'other') {
        this.openCategoryModal();
        this.addCategory = true;
        this.productInfoForm.controls['productCategory'].setValue('');
      }
      else if(this.productInfoForm.value.productCategory && this.productInfoForm.value.productCategory != 'other')  {
        this.addCategory = false
      }
    })
  }

  getPageData() {
    this.setUpForm()
    this.getProductCats();
    this.getSuppliers()
  }

  getProductCats()  {
    this.ordersService.getProductCategories().subscribe(res => {
      if(res.success) {
        this.productCategories = res.data
        this.productCatOptions = this.arrayToCatObject(this.productCategories, 'name');
        this.productInfoFields.find(item => {
          if(item.controlName == 'productCategory') item.selectOptions = this.productCatOptions;
        })
      }
    })
  }

  getSuppliers() {
    this.ordersService.getSuppliers().subscribe(res => {
      if(res.success) {
        this.supplierList = res.data
        this.productInfoFields.find(item => {
          if(item.controlName == 'primarySupplier') item.selectOptions = this.arrayToObject(this.supplierList, 'supplierName');
        })
      }
    })
  }


  setUpForm = async () => {
    
    this.productInfoFields = [
      {
        controlName: 'productName',
        controlType: 'text',
        controlLabel: 'Product Name',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'productCategory',
        controlType: 'modifyOptions',
        controlLabel: 'Product Category',
        controlWidth: '48%',
        initialValue: null,
        selectOptions: {},
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'productType',
        controlType: 'select',
        controlLabel: 'Product Type',
        controlWidth: '48%',
        initialValue: null,
        selectOptions: {
          Stocked: 'Stocked',
          OnRequest: 'On-Request'
        },
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'primarySupplier',
        controlType: 'select',
        controlLabel: 'Product Primary Supplier',
        controlWidth: '48%',
        initialValue: null,
        selectOptions: {},
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'sku',
        controlType: 'text',
        controlLabel: 'Product SKU',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'partNo',
        controlType: 'text',
        controlLabel: 'Part Number',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'productWeight',
        controlType: 'number',
        controlLabel: 'Product Weight',
        controlWidth: '48%',
        initialValue: '',
        validators: [],
        order: 7
      },
      {
        controlName: 'weightUnit',
        controlType: 'select',
        controlLabel: 'Product Weight Unit',
        controlWidth: '48%',
        initialValue: null,
        selectOptions: this.arrayToObject(this.weightUnits, 'name'),
        validators: [Validators.required],
        order: 8
      },
      {
        controlName: 'productLength',
        controlType: 'number',
        controlLabel: 'Product Length',
        controlWidth: '48%',
        initialValue: '',
        validators: [],
        order: 9
      },
      {
        controlName: 'lengthUnit',
        controlType: 'select',
        controlLabel: 'Product Length Unit',
        controlWidth: '48%',
        initialValue: null,
        selectOptions: this.arrayToObject(this.lengthUnits, 'name'),
        validators: [],
        order: 10
      },
      {
        controlName: 'productWidth',
        controlType: 'number',
        controlLabel: 'Product Width',
        controlWidth: '48%',
        initialValue: '',
        validators: [],
        order: 11
      },
      {
        controlName: 'widthUnit',
        controlType: 'select',
        controlLabel: 'Product Width Unit',
        controlWidth: '48%',
        initialValue: null,
        selectOptions: this.arrayToObject(this.lengthUnits, 'name'),
        validators: [],
        order: 12
      },
      {
        controlName: 'productHeight',
        controlType: 'number',
        controlLabel: 'Product Height',
        controlWidth: '48%',
        initialValue: '',
        validators: [],
        order: 13
      },
      {
        controlName: 'heightUnit',
        controlType: 'select',
        controlLabel: 'Product Height Unit',
        controlWidth: '48%',
        initialValue: null,
        selectOptions: this.arrayToObject(this.lengthUnits, 'name'),
        validators: [],
        order: 14
      },
      {
        controlName: 'productDescription',
        controlType: 'textarea',
        controlLabel: 'Product Description',
        controlWidth: '100%',
        initialValue: '',
        validators: [],
        order: 15
      },
      {
        controlName: 'productImage',
        controlType: 'file',
        controlLabel: '',
        controlWidth: '100%',
        initialValue: null,
        validators: [],
        order: 16
      },
    ]
    this.productInfoFields.sort((a,b) => (a.order - b.order));

    this.productInfoFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.productInfoForm.addControl(field.controlName, formControl)
    });
  }

  goBack() {
    this.location.back();
  }

  
  productImgUpload(event) {
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

  //Converts an array to an Object of key value pairs
  arrayToCatObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    reqObj = {
      ...reqObj,
      'other': 'Add New Category'
    }
    return reqObj;
  }

  arrayToObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    return reqObj;
  }

  onSubmit() {
    this.apiLoading = true
    if(this.productInfoForm.valid) {
      const formData = new FormData();

      formData.append('productImage', this.imgFile);
      formData.append('productName', this.productInfoForm.value.productName);
      formData.append('productType', this.productInfoForm.value.productType);
      formData.append('productCategory', this.productInfoForm.value.productCategory);
      formData.append('supplierId', this.productInfoForm.value.primarySupplier);
      formData.append('sku', this.productInfoForm.value.sku);
      formData.append('partNumber', this.productInfoForm.value.partNo);
      formData.append('productWeight', this.productInfoForm.value.productWeight);
      formData.append('productWeightUnit', this.productInfoForm.value.weightUnit);
      formData.append('productLength', this.productInfoForm.value.productLength);
      formData.append('productLengthUnit', this.productInfoForm.value.lengthUnit);
      formData.append('productWidth', this.productInfoForm.value.productWidth);
      formData.append('productWidthUnit', this.productInfoForm.value.widthUnit);
      formData.append('productHeight', this.productInfoForm.value.productHeight);
      formData.append('productHeightUnit', this.productInfoForm.value.heightUnit);
      formData.append('productDescription', this.productInfoForm.value.productDescription);

      this.ordersService.createProduct(formData).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('This product has been created successfully');
            this.apiLoading = false;
            this.goBack();
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

  addStock() {
    let dialogRef = this.dialog.open(StockInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        isExisting: false,
      },
    });
  }

  addNewCategory() {
    if(this.addCategory) {
      this.openCategoryModal();
    }
  }

  openCategoryModal() {
    let dialogRef = this.dialog.open(ProductCategoryComponent, {
      width: '30%',
      height: 'auto',
      data: {
        isExisting: false,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log('New Category', res)
      if(res.data) {
        this.productInfoForm.controls['productCategory'].setValue(res.data._id);
        console.log(this.productInfoForm)
        this.getProductCats();
      }
    }); 
  }

}
