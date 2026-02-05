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
import { PayrollCreditInfoComponent } from '../payroll-credit-info/payroll-credit-info.component';
import { PayrollDebitInfoComponent } from '../payroll-debit-info/payroll-debit-info.component';
import { FormGroup } from '@angular/forms';
import { SalaryScaleInfoComponent } from '../salary-scale-info/salary-scale-info.component';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-payroll-overview',
  templateUrl: './payroll-overview.component.html',
  styleUrls: ['./payroll-overview.component.scss']
})
export class PayrollOverviewComponent implements OnInit {

  payrollCreditList: any[] = [];
  payrollDebitList: any[] = [];
  salaryScales:any[];
  sideModalOpened: boolean = false;
  activeTab:number = -1;
  salaryScaleInView$ = new BehaviorSubject<any>(null);
  editMode:boolean;
  salaryScalesLoading:boolean = false;

  displayedPayrollCreditColumns: any[];
  displayedPayrollDebitColumns: any[];

  dataSourcePayrollCredits: MatTableDataSource<any>;
  dataSourcePayrollDebits: MatTableDataSource<any>;

  //Payroll Credits Table Column Names
  tableColumnsPayrollCredits: TableColumn[] = [
    {
      key: "name",
      label: "Name",
      order: 1,
      columnWidth: "90%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "actions",
      label: "Actions",
      order: 12,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    }
  ]

  //Payroll Debits Table Column Names
  tableColumnsPayrollDebits: TableColumn[] = [
    {
      key: "name",
      label: "Name",
      order: 1,
      columnWidth: "35%",
      cellStyle: "width: 100%",
      sortable: false
    },
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
    this.tableColumnsPayrollCredits.sort((a,b) => (a.order - b.order));
    this.displayedPayrollCreditColumns = this.tableColumnsPayrollCredits.map(column => column.label);
    this.getPayrollCredits();
    
    this.tableColumnsPayrollDebits.sort((a,b) => (a.order - b.order));
    this.displayedPayrollDebitColumns = this.tableColumnsPayrollDebits.map(column => column.label);
    this.getPayrollDebits();

    this.getSalaryScales()
  }

  /*************** PAYROLL CREDIT TYPES RELATED ACTIONS ***************/
  
  //Get all payroll credit types
  getPayrollCredits() {
    this.hrService.getPayrollCredits().subscribe((res:any) => {
      this.payrollCreditList = res.data;
      this.dataSourcePayrollCredits = new MatTableDataSource(this.payrollCreditList);
    });
  }

  //Create a new payroll credit type
  createPayrollCredit() {
    this.dialog.open(PayrollCreditInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: '',
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getPayrollCredits();
    });
  }

  //Edit a payroll credit type
  editPayrollCredit(details: any) {
    this.dialog.open(PayrollCreditInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.name,
        id: details._id,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPayrollCredits();
    });
  }

  //Delete a payroll credit type
  deletePayrollCredit(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.name,
      message: 'Are you sure you want to remove this payroll credit type?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deletePayrollCredit(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The payroll credit type has been deleted successfully');
            }
            this.getPayrollCredits();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  /*************** PAYROLL DEBIT TYPES RELATED ACTIONS ***************/

  //Get all payroll debit types
  getPayrollDebits() {
    this.hrService.getPayrollDebits().subscribe((res:any) => {
      this.payrollDebitList = res.data;
      this.dataSourcePayrollDebits = new MatTableDataSource(this.payrollDebitList);
    });
  }

  //Create a new payroll debit type
  createPayrollDebit() {
    this.dialog.open(PayrollDebitInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: '',
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getPayrollDebits();
    });
  }

  //Edit a payroll debit type
  editPayrollDebit(details: any) {
    this.dialog.open(PayrollDebitInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.name,
        id: details._id,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPayrollDebits();
    });;
  }

  //Delete a payroll debit type
  deletePayrollDebit(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.name,
      message: 'Are you sure you want to remove this payroll debit type?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deletePayrollDebit(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('This payroll debit type has been deleted successfully');
            }
            this.getPayrollDebits();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }


  /*************** SALARY SCALE RELATED ACTIONS ***************/

  //Get all payroll salary scales
  getSalaryScales() {
    this.salaryScalesLoading = true;
    this.hrService.getSalaryScales().subscribe((res:any) => {
      this.salaryScales = res.data;
      this.salaryScalesLoading = false;
      console.log('Salary Scales', this.salaryScales)
    });
  }

  //Create Salary Scale
  createSalaryScale() {
    this.salaryScaleInView$.next(null);
    this.editMode = false;
    this.sideModalOpened = true;
    // this.dialog.open(SalaryScaleInfoComponent, {
    //   width: '45%',
    //   height: 'auto',
    //   data: {
    //     payrollDebits: this.payrollDebitList,
    //     payrollCredits: this.payrollCreditList,
    //     isExisting: false
    //   },
    // }).afterClosed().subscribe(() => {
    //   this.getSalaryScales();
    // });
  }

  //Edit Salary Scale
  editSalaryScale(details: any) {
    this.salaryScaleInView$.next(details);
    this.editMode = true;
    this.sideModalOpened = true;
  }

  //Delete a salary scale
  deleteSalaryScale(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.name,
      message: 'Are you sure you want to remove this salary scale?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteSalaryScale(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('This salary scale has been deleted successfully');
            }
            this.getSalaryScales();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }


  toggleAccordionInfo(index:number) {
    this.activeTab == index ? this.activeTab = -1 : this.activeTab = index;
  }

  closeSideModal() {
    this.salaryScaleInView$.next(null);
    // console.log('I am closing side modal')
    this.sideModalOpened = !this.sideModalOpened
  }

}
