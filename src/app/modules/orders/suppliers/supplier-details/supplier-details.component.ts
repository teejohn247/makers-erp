import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, Location } from '@angular/common';
import { OrdersService } from '@services/orders/orders.service';
import { NotificationService } from '@services/utils/notification.service';
import { SupplierInfoComponent } from '../supplier-info/supplier-info.component';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.scss']
})
export class SupplierDetailsComponent implements OnInit {

  supplierId: string;
  supplierDetails:any;

  industriesList:any = [];

  constructor(
    private location: Location,
    public dialog: MatDialog,
    private router: Router,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this.supplierId = this.router.url.split('/')[4];
    this.getPageData();
  }

  goBack() {
    this.location.back();
  }

  getPageData = async () => {
    const supplierDetails$ = this.ordersService.getSupplier(this.supplierId).subscribe(res => this.supplierDetails = res.data);
    const industries$ = this.ordersService.getIndustries().subscribe(res => this.industriesList = res.data);
  }

  editSupplierInfo() {
    let dialogRef = this.dialog.open(SupplierInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        supplierDetails: this.supplierDetails,
        industries: this.industriesList,
        isExisting: true
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

}
