import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '@services/orders/orders.service';
import { NotificationService } from '@services/utils/notification.service';

@Component({
  selector: 'app-supplier-overview',
  templateUrl: './supplier-overview.component.html',
  styleUrls: ['./supplier-overview.component.scss']
})
export class SupplierOverviewComponent implements OnInit {

  supplierId: string;
  supplierDetails:any;

  tabMenu = [
    {
      routeLink: 'details',
      label: 'Supplier Information',
    },
    {
      routeLink: 'order-history',
      label: 'Order History',
    }
  ]

  constructor(
    private location: Location,
    private activatedRoute:ActivatedRoute,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this.supplierId=this.activatedRoute.snapshot.params["id"];

    const customerInfo$ = this.ordersService.getSupplier(this.supplierId)
    customerInfo$.subscribe(res => {
      this.supplierDetails = res.data;
      console.log(this.supplierDetails)
    })
  }

  goBack() {
    this.location.back();
  }

}
