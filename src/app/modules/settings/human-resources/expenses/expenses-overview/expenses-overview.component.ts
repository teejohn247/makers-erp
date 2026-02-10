import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { TableColumn } from 'src/app/shared/models/table-columns';
import { MatTableDataSource } from '@angular/material/table';
import * as Highcharts from 'highcharts';
import { DatePipe } from '@angular/common';
import { PayrollSummary } from 'src/app/shared/models/payroll-data';
import { MatDialog } from '@angular/material/dialog';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { SharedService } from 'src/app/shared/services/utils/shared.service';
import { ExpenseTypeInfoComponent } from '../expense-type-info/expense-type-info.component';

@Component({
  selector: 'app-expenses-overview',
  templateUrl: './expenses-overview.component.html',
  styleUrls: ['./expenses-overview.component.scss']
})
export class ExpensesOverviewComponent implements OnInit {

  expenseTypesList: any[] = [];
  displayedColumns: any[];
  dataSource: MatTableDataSource<any>;

  //Expense Type Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "expenseType",
      label: "Expense Type",
      order: 1,
      columnWidth: "30%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "description",
      label: "Description",
      order: 2,
      columnWidth: "40%",
      cellStyle: "width: 100%",
      sortable: true
    },
    // {
    //   key: "noOfEmployees",
    //   label: "Employee Count",
    //   order: 3,
    //   columnWidth: "30%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    {
      key: "actions",
      label: "Actions",
      order: 12,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    }

  ]

  constructor(
    public dialog: MatDialog,
    private route: Router,
    private datePipe: DatePipe,
    @Inject(HumanResourcesService) private hrService: HumanResourcesService, 
    @Inject(SharedService) private sharedService: SharedService,     
    @Inject(NotificationService) private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    const expenseTypes$ = this.hrService.getExpenseTypes().subscribe((res:any) => {
      this.expenseTypesList = res.data;
    });
    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.getExpenseTypes();
  }

  /*************** EXPENSE RELATED ACTIONS ***************/
    
  //Get all Expenses
  getExpenseTypes() {
    this.hrService.getExpenseTypes().subscribe((res:any) => {
      this.expenseTypesList = res.data;
      this.dataSource = new MatTableDataSource(this.expenseTypesList);
    });
  }
  
  //Create a new expense type
  createExpenseType() {
    this.dialog.open(ExpenseTypeInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: '',
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getExpenseTypes();
    });
  }

  //Edit an expense type
  editExpenseType(details: any) {
    this.dialog.open(ExpenseTypeInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.expenseTypeName,
        id: details._id,
        isExisting: true,
        modalInfo: details,
      },
    }).afterClosed().subscribe(() => {
      this.getExpenseTypes();
    });
  }

  //Delete an expense type
  deleteExpenseType(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.expenseTypeName,
      message: 'Are you sure you want to remove this expense type?',
      confirmText: 'Remove Expense Type',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteExpenseType(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('This expense type has been deleted successfully');
            }
            this.getExpenseTypes();
          },
          error: err => {
            console.log(err)
          } 
        })
      }
    });
  }

}
