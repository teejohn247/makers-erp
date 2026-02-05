import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '@services/orders/orders.service';
import { NotificationService } from '@services/utils/notification.service';

@Component({
  selector: 'app-customer-overview',
  templateUrl: './customer-overview.component.html',
  styleUrls: ['./customer-overview.component.scss']
})
export class CustomerOverviewComponent implements OnInit {
  customerId: string;
  customerDetails:any;

  tabMenu = [
    {
      routeLink: 'details',
      label: 'Customer Information',
    },
    {
      routeLink: 'orders',
      label: 'Order History',
    }
  ]

  constructor(
    private location: Location,
    private activatedRoute:ActivatedRoute,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this.customerId=this.activatedRoute.snapshot.params["id"];

    const customerInfo$ = this.ordersService.getCustomer(this.customerId)
    customerInfo$.subscribe(res => {
      this.customerDetails = res.data;
      console.log(this.customerDetails)
    })
  }

  goBack() {
    this.location.back();
  }

}
