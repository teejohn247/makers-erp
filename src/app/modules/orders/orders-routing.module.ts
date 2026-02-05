import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersDashboardComponent } from './components/orders-dashboard/orders-dashboard.component';
import { PurchaseOrdersHistoryComponent } from './purchase-orders/purchase-orders-history/purchase-orders-history.component';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { SupplierListComponent } from './suppliers/supplier-list/supplier-list.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { FreightCarrierListComponent } from './logistics/freight-carrier-list/freight-carrier-list.component';
import { ProductInfoComponent } from './products/product-info/product-info.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { PurchaseOrdersInfoComponent } from './purchase-orders/purchase-orders-info/purchase-orders-info.component';
import { CustomerOverviewComponent } from './customers/customer-overview/customer-overview.component';
import { CustomerDetailsComponent } from './customers/customer-details/customer-details.component';
import { CustomerSalesComponent } from './customers/customer-sales/customer-sales.component';
import { ProductSalesComponent } from './products/product-sales/product-sales.component';
import { ProductStockHistoryComponent } from './products/product-stock-history/product-stock-history.component';
import { ProductOverviewComponent } from './products/product-overview/product-overview.component';
import { SupplierOverviewComponent } from './suppliers/supplier-overview/supplier-overview.component';
import { SupplierDetailsComponent } from './suppliers/supplier-details/supplier-details.component';
import { SupplierOrderHistoryComponent } from './suppliers/supplier-order-history/supplier-order-history.component';
import { CourierListComponent } from './couriers/courier-list/courier-list.component';
import { CourierOverviewComponent } from './couriers/courier-overview/courier-overview.component';
import { CourierDetailsComponent } from './couriers/courier-details/courier-details.component';
import { CourierDeliveryHistoryComponent } from './couriers/courier-delivery-history/courier-delivery-history.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
    //component: EmployeesListComponent
  },
  {
    path: 'dashboard',
    component: OrdersDashboardComponent
  },
  {
    path: 'purchase-orders',
    component: PurchaseOrdersHistoryComponent
  },
  {
    path: 'purchase-orders/new',
    component: PurchaseOrdersInfoComponent
  },
  {
    path: 'customers',
    component: CustomerListComponent
  },
  {
    path: 'customers/:id',
    component: CustomerOverviewComponent,
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full'
      },
      {
        path : 'details',
        component: CustomerDetailsComponent
      },
      {
        path: 'orders',
        component: CustomerSalesComponent
      },
    ]
  },
  {
    path: 'suppliers',
    component: SupplierListComponent
  },
  {
    path: 'suppliers/:id',
    component: SupplierOverviewComponent,
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full'
      },
      {
        path : 'details',
        component: SupplierDetailsComponent
      },
      {
        path : 'order-history',
        component: SupplierOrderHistoryComponent
      },
      // {
      //   path: 'sales',
      //   component: ProductSalesComponent
      // },
    ]
  },
  {
    path: 'products',
    component: ProductListComponent
  },
  {
    path: 'products/new',
    component: ProductInfoComponent
  },
  {
    path: 'products/:id',
    component: ProductOverviewComponent,
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full'
      },
      {
        path : 'details',
        component: ProductDetailsComponent
      },
      {
        path : 'stock-history',
        component: ProductStockHistoryComponent
      },
      {
        path: 'sales-history',
        component: ProductSalesComponent
      },
    ]
  },
  {
    path: 'couriers',
    component: CourierListComponent
  },
  {
    path: 'couriers/:id',
    component: CourierOverviewComponent,
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full'
      },
      {
        path : 'details',
        component: CourierDetailsComponent
      },
      {
        path : 'delivery-history',
        component: CourierDeliveryHistoryComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
