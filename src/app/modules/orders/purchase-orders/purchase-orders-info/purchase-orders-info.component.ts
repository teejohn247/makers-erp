import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, FormArray } from '@angular/forms';
import { FormFields } from 'src/app/shared/models/form-fields';
import { WEIGHT_UNITS, LENGTH_UNITS } from 'src/app/core/constants/general-data';
import { CustomerInfoComponent } from '../../customers/customer-info/customer-info.component';

@Component({
  selector: 'app-purchase-orders-info',
  templateUrl: './purchase-orders-info.component.html',
  styleUrls: ['./purchase-orders-info.component.scss']
})
export class PurchaseOrdersInfoComponent implements OnInit {

  orderInfoForm!: FormGroup;
  productList: any[] = [];
  customerList: any[] = [];
  supplierList: any[] = [];
  courierList:any[] = [];
  poList: any[] = [];

  orderTypeOptions:any;
  productListOptions:any;
  customerListOptions:any;
  supplierListOptions: any;
  courierListOptions:any;
  refOrdersOptions:any = {
    PO11234: 'PO11234',
    PO434343: 'PO434343'
  };

  productDetails:FormArray;
  supplierDetails: FormArray;
  courierDetails: FormArray;

  activeProductTab:number = 0;
  activeSupplierTab:number = -1;
  activeCourierTab:number = -1;

  imgFile: File;
  imgFileName: string;
  imgPic: string | SafeUrl;
  imgUploadError:string;

  apiLoading:boolean = false;
  addCustomer:boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private location: Location,
    public dialog: MatDialog,
    // @Inject(MAT_DIALOG_DATA) public dialogData: any,
    // public dialogRef: MatDialogRef<CustomerInfoComponent>,
    private ordersService: OrdersService,
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.orderInfoForm = new FormGroup({
      customerId: new FormControl('', [Validators.required]),
      internalOrderRefNo: new FormControl('', [Validators.required]),
      orderType: new FormControl('', [Validators.required]),
      dateRequested: new FormControl(null, [Validators.required]),
      dueDate: new FormControl(null, [Validators.required]),
      refPurchaseOrders: new FormControl([]),
      productDetails: new FormArray([]),
      supplierDetails: new FormArray([]),
      courierDetails: new FormArray([])
    })

    this.getPageData();
  }

  getPageData = async () =>  {
    this.orderTypeOptions = {
      inward: 'Inward',
      outward: 'Outward'
    };

    this.productDetails = this.orderInfoForm.get("productDetails") as FormArray;
    this.addProduct();

    this.supplierDetails = this.orderInfoForm.get('supplierDetails') as FormArray;
    this.addSupplier();

    this.courierDetails = this.orderInfoForm.get('courierDetails') as FormArray;
    this.addCourier();

    this.productList = await this.ordersService.getProducts().toPromise();
    this.productList = this.productList['data'];
    this.productListOptions = this.arrayToObject(this.productList, 'productName');

    this.customerList = await this.ordersService.getCustomers().toPromise();
    this.customerList = this.customerList['data'];
    this.customerListOptions = this.arrayToObject(this.customerList, 'firstName')

    this.supplierList = await this.ordersService.getSuppliers().toPromise();
    this.supplierList = this.supplierList['data'];
    this.supplierListOptions = this.arrayToObject(this.supplierList, 'supplierName');

    this.courierList = await this.ordersService.getCouriers().toPromise();
    this.courierList = this.courierList['data'];
    this.courierListOptions = this.arrayToObject(this.courierList, 'courierName');

    // this.poList = await this.ordersService.getPurchaseOrders().toPromise();
    // this.poList = this.poList['data'];
    // this.productListOptions = this.arrayToObject(this.poList, 'orderNo');


    console.log('PO MODEL', this.orderInfoForm.value)

  }

  goBack() {
    this.location.back();
  }
  
  attachmentImgUpload(event) {
    this.imgFile = event.target.files[0];
    const img = new Image();
    let imgWidth;
    let imgHeight;
    let imgRatio;
    img.src = window.URL.createObjectURL(event.target.files[0]);
    img.onload = () => {
      if (this.imgFile.size > 1000000) {
        this.imgUploadError = 'Please check that your file size is not more than 1MB';
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

  arrayToObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    return reqObj;
  }

  addNewCustomer() {
    if(this.addCustomer) {
      this.openCustomerModal();
    }
  }

  openCustomerModal() {
    let dialogRef = this.dialog.open(CustomerInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        isExisting: false,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log('New Customer', res)
      if(res.data) {
        // this.productInfoForm.controls['productCategory'].setValue(res.data._id);
        // console.log(this.productInfoForm)
        // this.getProductCats();
      }
    }); 
  }

  addProduct() {
    const product = new FormGroup({
      product: new FormControl('', Validators.required),
      quantity: new FormControl(1, Validators.required),
      stock: new FormControl('', Validators.required),
      unitPrice: new FormControl(0, Validators.required),
      tax: new FormControl(0, Validators.required),
      subTotal: new FormControl(0, Validators.required)
    });

    this.productDetails.push(product);
  }
  removeProduct(index: number) {
    this.productDetails.removeAt(index);
  }
  toggleProductInfo(index:number) {
    this.activeProductTab == index ? this.activeProductTab = -1 : this.activeProductTab = index;
  }

  addSupplier() {
    const supplier = new FormGroup({
      supplier: new FormControl('', Validators.required),
      product: new FormControl('', Validators.required),
      supplierOrderDate: new FormControl('', Validators.required),
      supplierDeliveryDate: new FormControl('', Validators.required)
    });

    this.supplierDetails.push(supplier);
  }
  removeSupplier(index: number) {
    this.supplierDetails.removeAt(index);
  }
  toggleSupplierInfo(index:number) {
    this.activeSupplierTab == index ? this.activeSupplierTab = -1 : this.activeSupplierTab = index;
  }

  addCourier() {
    const courier = new FormGroup({
      courier: new FormControl('', Validators.required),
      products: new FormControl([], Validators.required),
      packageWeight: new FormControl(0, Validators.required),
      packageWeightUnit: new FormControl('', Validators.required),
      courierCost: new FormControl(0, Validators.required),
      courierCostCurrency: new FormControl('', Validators.required),
      courierOrderDate: new FormControl('', Validators.required),
      courierDeliveryDate: new FormControl('', Validators.required)
    });

    this.courierDetails.push(courier);
  }
  removeCourier(index: number) {
    this.courierDetails.removeAt(index);
  }
  toggleCourierInfo(index:number) {
    this.activeCourierTab == index ? this.activeCourierTab = -1 : this.activeCourierTab = index;
  }

  removeRefOrder(refOrder: string) {
    const selectedPOs = this.orderInfoForm.value['refPurchaseOrders'] as string[];
    this.removeFirst(selectedPOs, refOrder);
    this.orderInfoForm.get['refPurchaseOrders'].setValue(selectedPOs); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  removeCourierProduct(product, index) {
    const selectedProducts = this.courierDetails.controls[index].value['products'] as string[];
    this.removeFirst(selectedProducts, product);
    this.courierDetails.controls[index].setValue(selectedProducts); // To trigger change detection
  }

}
