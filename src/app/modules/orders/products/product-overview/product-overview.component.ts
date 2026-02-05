import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { OrdersService } from '@services/orders/orders.service';
import { NotificationService } from '@services/utils/notification.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-product-overview',
  templateUrl: './product-overview.component.html',
  styleUrls: ['./product-overview.component.scss']
})
export class ProductOverviewComponent implements OnInit {

  productId: string;
  productDetails:any;
  currentRoute: string = 'details';

  tabMenu = [
    {
      routeLink: 'details',
      label: 'Product Information',
    },
    {
      routeLink: 'stock-history',
      label: 'Stock History',
    },
    {
      routeLink: 'sales-history',
      label: 'Sales history',
    },
  ]

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute:ActivatedRoute,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this.productId=this.activatedRoute.snapshot.params["id"];

    this.updateCurrentRoute(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const segments = this.router.url.split('/');
        this.currentRoute = segments[5] || null;
      }
    );

    const productInfo$ = this.ordersService.getProductDetails(this.productId)
    productInfo$.subscribe(res => {
      this.productDetails = res.data;
      console.log(this.productDetails)
    })
  }

  goBack() {
    this.location.back();
  }

  updateCurrentRoute(url: string): void {
    const segments = url.split('/');
    this.currentRoute = segments[5] || null;
  }

}
