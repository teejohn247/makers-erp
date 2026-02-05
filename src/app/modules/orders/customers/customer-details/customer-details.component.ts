import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, Location } from '@angular/common';
import { OrdersService } from '@services/orders/orders.service';
import { NotificationService } from '@services/utils/notification.service';
import { CustomerInfoComponent } from '../customer-info/customer-info.component';


@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  customerId: string;
  customerDetails:any;

  industriesList:any = [];

  constructor(
    private location: Location,
    public dialog: MatDialog,
    private router: Router,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this.customerId=this.router.url.split('/')[4];
    this.getPageData();
  }

  goBack() {
    this.location.back();
  }

  getPageData = async () => {
    const employeeDetails$ = this.ordersService.getCustomer(this.customerId).subscribe(res => this.customerDetails = res.data);
    const industries$ = this.ordersService.getIndustries().subscribe(res => this.industriesList = res.data);
  }

  editCustomerInfo() {
    let dialogRef = this.dialog.open(CustomerInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        customerDetails: this.customerDetails,
        industries: this.industriesList,
        isExisting: true
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

}
