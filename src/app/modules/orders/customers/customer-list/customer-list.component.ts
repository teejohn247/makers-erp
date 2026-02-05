import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from '@services/orders/orders.service';
import { NotificationService } from '@services/utils/notification.service';
import { CustomerInfoComponent } from '../customer-info/customer-info.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: any[];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  customerList: any[] = [];
  industriesList: any[] = [];

  //Customer Table Column Names
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
      key: "image",
      label: "Image",
      order: 2,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "name",
      label: "Name",
      order: 4,
      columnWidth: "11%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "email",
      label: "Email Address",
      order: 6,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "phone",
      label: "Phone Number",
      order: 7,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    // {
    //   key: "dateOfBirth",
    //   label: "Date of Birth",
    //   order: 8,
    //   columnWidth: "8%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    {
      key: "companyName",
      label: "Company",
      order: 8,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "location",
      label: "Location",
      order: 9,
      columnWidth: "13%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "activeStatus",
      label: "Status",
      order: 10,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "actions",
      label: "Actions",
      order: 11,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      sortable: true
    }

  ]

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private ordersService: OrdersService,
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.getPageData();
  }

  getPageData = async () =>  {
    this.industriesList = await this.ordersService.getIndustries().toPromise();
    this.industriesList = this.industriesList['data']

    this.customerList = await this.ordersService.getCustomers().toPromise();
    console.log(this.customerList)

    this.dataSource = new MatTableDataSource(this.customerList['data']);
    this.dataSource.sort = this.sort;
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

  addNewCustomer() {
    let dialogRef = this.dialog.open(CustomerInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        isExisting: false,
        industries: this.industriesList
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPageData();
    }); 
  }

  viewCustomer(customerInfo) {
    this.router.navigateByUrl(`app/orders/customers/${customerInfo._id}`);
  }

  //Delete a customer
  deleteCustomer(info: any) {
    // console.log(info);
    this.notifyService.confirmAction({
      title: 'Remove Customer',
      message: `Are you sure you want to remove ${info.firstName ? info.firstName + ' ' + info.lastName : info.companyName} as a customer?`,
      confirmText: 'Remove Customer',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.ordersService.deleteCustomer(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The customer has been deleted successfully');
            }
            this.getPageData();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  addBulkCustomers() {

  }

}
