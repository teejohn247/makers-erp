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
import { LeaveTypeInfoComponent } from '../leave-type-info/leave-type-info.component';
import { PublicHolidayInfoComponent } from '../public-holiday-info/public-holiday-info.component';

@Component({
  selector: 'app-absence-overview',
  templateUrl: './absence-overview.component.html',
  styleUrls: ['./absence-overview.component.scss']
})
export class AbsenceOverviewComponent implements OnInit {

  leaveTypeList: any[] = [];
  publicHolidayList: any[] = [];

  displayedLeaveTypeColumns: any[];
  displayedHolidayColumns: any[];

  dataSourceLeaveTypes: MatTableDataSource<any>;
  dataSourceHolidays: MatTableDataSource<any>;

  //Leave Types Table Column Names
  tableColumnsLeaveTypes: TableColumn[] = [
    {
      key: "leaveName",
      label: "Name",
      order: 1,
      columnWidth: "35%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "description",
      label: "Description",
      order: 3,
      columnWidth: "40%",
      cellStyle: "width: 100%",
      sortable: true
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

  //Holidays Table Column Names
  tableColumnsHolidays: TableColumn[] = [
    {
      key: "holidayName",
      label: "Name",
      order: 1,
      columnWidth: "35%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "date",
      label: "Date",
      order: 3,
      columnWidth: "40%",
      cellStyle: "width: 100%",
      sortable: true
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
    this.tableColumnsLeaveTypes.sort((a,b) => (a.order - b.order));
    this.displayedLeaveTypeColumns = this.tableColumnsLeaveTypes.map(column => column.label);
    this.getLeaveTypes();
    
    this.tableColumnsHolidays.sort((a,b) => (a.order - b.order));
    this.displayedHolidayColumns = this.tableColumnsHolidays.map(column => column.label);
    this.getPublicHolidays();
  }

  /*************** LEAVE TYPES RELATED ACTIONS ***************/

  //Get all leave types
  getLeaveTypes() {
    this.hrService.getLeaveTypes().subscribe((res:any) => {
      this.leaveTypeList = res.data
      this.dataSourceLeaveTypes = new MatTableDataSource(this.leaveTypeList);
    });
  }

  //Create a new leave type
  createLeaveType() {
    this.dialog.open(LeaveTypeInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: '',
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getLeaveTypes();
    });
  }

  //Edit a leave type
  editLeaveType(details: any) {
    this.dialog.open(LeaveTypeInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.leaveName,
        id: details._id,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getLeaveTypes();
    });;
  }

  //Delete a leave type
  deleteLeaveType(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.leaveName + ' Leave Type',
      message: 'Are you sure you want to remove this leave type?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteLeaveType(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The leave type has been deleted successfully');
            }
            this.getLeaveTypes();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  /*************** PUBLIC HOLIDAYS RELATED ACTIONS ***************/

  //Get all holidays
  getPublicHolidays() {
    this.hrService.getPublicHolidays().subscribe((res:any) => {
      this.publicHolidayList = res.data
      this.dataSourceHolidays = new MatTableDataSource(this.publicHolidayList);
    });
  }

  //Create a new public holiday
  createPublicHoliday() {
    this.dialog.open(PublicHolidayInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        name: '',
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getPublicHolidays();
    });
  }

  //Edit a public holiday
  editPublicHoliday(details: any) {
    this.dialog.open(PublicHolidayInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        name: details.holidayName,
        id: details._id,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPublicHolidays();
    });;
  }

  //Delete a public holiday
  deletePublicHoliday(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.holidayName + ' Holiday',
      message: 'Are you sure you want to remove this public holiday?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deletePublicHoliday(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The public holiday has been deleted successfully');
            }
            this.getPublicHolidays();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

}
