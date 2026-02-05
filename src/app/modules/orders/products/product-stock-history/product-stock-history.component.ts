import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StockInfoComponent } from '../stock-info/stock-info.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-product-stock-history',
  templateUrl: './product-stock-history.component.html',
  styleUrls: ['./product-stock-history.component.scss']
})
export class ProductStockHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  productId:string;
  productInView:any;
  displayedColumns: any[];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  stockHistory: any[] = [];
  supplierList:any[] = [];
  apiLoading:boolean = false;

  //Stock History Column Names
  tableColumns: any[] = [
    {
      key: "select",
      label: "Select",
      order: 1,
      columnWidth: "3%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "stockId",
      label: "Stock ID",
      order: 2,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "createdAt",
      label: "Stock Date",
      order: 3,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "supplierName",
      label: "Supplier",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "quantity",
      label: "Quantity",
      order: 5,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "unitCostPrice",
      label: "Cost Price",
      order: 6,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "unitSellingPrice",
      label: "Selling Price",
      order: 7,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "quantitySold",
      label: "Qty Sold",
      order: 8,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "dateExhausted",
      label: "Exhausted",
      order: 10,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      order: 11,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "actions",
      label: "Actions",
      order: 12,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      sortable: true
    }

  ]

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private ordersService: OrdersService,
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.parent?.params.subscribe(params => {
      this.productId = params['id'];
      if(this.productId) {
        this.getStockData();
        // this.getProductDetails(this.productId);
        this.getPageData();
      };      
    });

    this.displayedColumns = this.tableColumns.map(column => column.label);
  }

  getPageData = async () =>  {
    const productInfo$ = this.ordersService.getProductDetails(this.productId)
    productInfo$.subscribe(res => {
      this.productInView = res.data;
      console.log(this.productInView)
    })

    const suppliers$ = this.ordersService.getSuppliers().subscribe(res => {
      this.supplierList = res.data;
    })

    
  }

  getStockData() {
    console.log(this.stockHistory)
    this.apiLoading = true;
    const stockData$ = this.ordersService.getStockHistory(this.productId).subscribe(res => {
      this.stockHistory = res.data;
      console.log(this.stockHistory)
      this.dataSource = new MatTableDataSource(this.stockHistory);
      this.dataSource.sort = this.sort;
      this.apiLoading = false
    })
  }

  goBack() {
    this.location.back();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  addStock() {
    console.log(this.productInView);
    let dialogRef = this.dialog.open(StockInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        isExisting: false,
        suppliers: this.supplierList,
        productInfo: [{
          _id: this.productId,
          name: this.productInView.productName
        }]
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getStockData();
    });
  }

}
