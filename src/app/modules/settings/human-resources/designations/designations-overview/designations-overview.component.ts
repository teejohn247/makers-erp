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
import { DesignationInfoComponent } from '../designation-info/designation-info.component';

@Component({
  selector: 'app-designations-overview',
  templateUrl: './designations-overview.component.html',
  styleUrls: ['./designations-overview.component.scss']
})
export class DesignationsOverviewComponent implements OnInit {

  leaveTypes: any[] = [];
  designationList: any[] = [];
  displayedColumns: any[];
  dataSource: MatTableDataSource<any>;

  //Department Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "designationName",
      label: "Name",
      order: 1,
      columnWidth: "20%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "grade",
      label: "Grade",
      order: 2,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "description",
      label: "Description",
      order: 3,
      columnWidth: "20%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "expenseCardLimit",
      label: "Expense Limit",
      order: 4,
      columnWidth: "14%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "totalLeaveDays",
      label: "Leave Days",
      order: 5,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "employeeCount",
      label: "Employee Count",
      order: 5,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "actions",
      label: "Actions",
      order: 6,
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
    const leaveType$ = this.hrService.getLeaveTypes().subscribe((res:any) => this.leaveTypes = res.data);
    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.getDesignations()
  }


  /*************** DESIGNATION RELATED ACTIONS ***************/

  //Get all Designations
  getDesignations() {
    this.hrService.getDesignations().subscribe((res:any) => {
      this.designationList = res.data;
      console.log(this.designationList)
      this.dataSource = new MatTableDataSource(this.designationList);
    });
  }

  //Create a new designation
  createDesignation() {
    this.dialog.open(DesignationInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        name: '',
        leaveTypes: this.leaveTypes,
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getDesignations();
    });
  }

  //Edit a designation
  editDesignation(details: any) {
    this.dialog.open(DesignationInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        name: details.designationName,
        id: details._id,
        leaveTypes: this.leaveTypes,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getDesignations();
    });;
  }

  //Delete a designation
  deleteDesignation(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.designationName + ' Designation',
      message: 'Are you sure you want to remove this designation?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteDesignation(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The designation has been deleted successfully');
            }
            this.getDesignations();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  calcNoOfLeaveDays(leaveDetails:any[]) {
    return leaveDetails.reduce((acc, obj) => { return acc + obj.noOfLeaveDays}, 0);
  }
}
