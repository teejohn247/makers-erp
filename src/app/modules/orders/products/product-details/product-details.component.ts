import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, Location } from '@angular/common';
import { OrdersService } from '@services/orders/orders.service';
import { NotificationService } from '@services/utils/notification.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  productId: string;
  productDetails:any;

  industriesList:any = [];

  constructor(
    private location: Location,
    public dialog: MatDialog,
    private router: Router,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this.productId=this.router.url.split('/')[4];
    this.getPageData();
  }

  goBack() {
    this.location.back();
  }
  
  getPageData = async () => {
    const productInfo$ = this.ordersService.getProductDetails(this.productId).subscribe(res => {
      this.productDetails = res.data;
    })
  }

  editProductInfo() {

  }

}
