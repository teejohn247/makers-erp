import { Component, OnInit, ViewChild } from '@angular/core';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Chart, Options } from 'highcharts';
import * as Highcharts from 'highcharts';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LeaveRequestTable } from 'src/app/shared/models/leave-requests';
import { FormFields } from '../../../../shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { LeaveReviewComponent } from 'src/app/modules/hr/leave-management/leave-review/leave-review.component';

@Component({
  selector: 'app-self-service-leave-requests',
  templateUrl: './self-service-leave-requests.component.html',
  styleUrls: ['./self-service-leave-requests.component.scss']
})
export class SelfServiceLeaveRequestsComponent implements OnInit {

  userDetails: any;
  userId: string;
  totalLeaveDays: number;
  leaveDaysUsed: number;
  leaveRecords: any[] = [];
  displayedColumns: any[];
  dataSource: MatTableDataSource<LeaveRequestTable>;
  chartOptions: Options;
  minDate: Date = new Date();
  currentPeriod:string;
  dataPeriods:any[] = ['2025', '2024', '2023', '2022']

  leaveSummary: any[] = [];
  leaveRequestFields: FormFields[];
  leaveForm!: FormGroup

  leaveBreakdown: any[] = [];
  leaveAttr: any[] = [
    {
      colorDark: "rgba(66, 133, 244, 1)",
      colorLight: "rgba(66, 133, 244, 0.2)",
      icon: "bi bi-cash"
    },
    {
      colorDark: "rgb(235, 87, 87)",
      colorLight: "rgba(235, 87, 87, 0.2)",
      icon: "bi bi-exclamation-diamond"
    },
    {
      colorDark: "rgb(191,148,60)",
      colorLight: "rgba(191,148,60, 0.2)",
      icon: "bi bi-bandaid"
    },
    {
      colorDark: "rgb(235, 87, 87)",
      colorLight: "rgba(235, 87, 87, 0.2)",
      icon: "bi bi-exclamation-diamond"
    },
    {
      colorDark: "rgb(235, 87, 87)",
      colorLight: "rgba(235, 87, 87, 0.2)",
      icon: "bi bi-exclamation-diamond"
    },
    {
      colorDark: "rgb(191,148,60)",
      colorLight: "rgba(191,148,60, 0.2)",
      icon: "bi bi-bandaid"
    },
  ]

  //Leave Request Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "leaveTypeName",
      label: "Absence Type",
      order: 1,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "requestDate",
      label: "Date Submitted",
      order: 8,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "leaveStartDate",
      label: "Start Date",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "leaveEndDate",
      label: "End Date",
      order: 5,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "approver",
      label: "Approver",
      order: 6,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      order: 9,
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
      key: "actions",
      label: "Actions",
      order: 10,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    }

  ]

  tableData: LeaveRequestTable[] = [
    {
      id: 1,
      "Employee ID": "EMP-2021-MB45",
      "Leave Type": "Paid",
      "First Name": "Mellie",
      "Last Name": "Gabbott",
      "Date Submitted": "Jan 10, 2023",
      "Start Date": "Feb 11, 2023",
      "End Date": "Feb 27, 2023",
      "Approver": "Simon Dowen",
      "Status": "Approved"
    },
    {
      id: 2,
      "Employee ID": "EMP-2021-MB45",
      "Leave Type": "Paid",
      "First Name": "Mellie",
      "Last Name": "Gabbott",
      "Date Submitted": "Feb 4, 2023",
      "Start Date": "Mar 24, 2023",
      "End Date": "April 27, 2023",
      "Approver": "Simon Dowen",
      "Status": "Pending"
    },
    {
      id: 3,
      "Employee ID": "EMP-2021-MB45",
      "Leave Type": "Sick",
      "First Name": "Mellie",
      "Last Name": "Gabbott",
      "Date Submitted": "Mar 5, 2023",
      "Start Date": "July 11, 2023",
      "End Date": "July 15, 2023",
      "Approver": "Simon Dowen",
      "Status": "Approved"
    },
    {
      id: 4,
      "Employee ID": "EMP-2021-MB45",
      "Leave Type": "Unpaid",
      "First Name": "Mellie",
      "Last Name": "Gabbott",
      "Date Submitted": "April 20, 2023",
      "Start Date": "Sep 12, 2023",
      "End Date": "Sep 14, 2023",
      "Approver": "Simon Dowen",
      "Status": "Declined"
    },
  ]

  constructor(    
    private hrService: HumanResourcesService,
    private notifyService: NotificationService,     
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public dialog: MatDialog,
  ) {
    this.getPageData();  
  }

  ngOnInit(): void {
    this.userDetails = JSON.parse(sessionStorage.getItem("loggedInUser"))['data'];
    console.log(this.userDetails);
    this.userId = this.userDetails._id;

    if(this.userDetails.leaveAssignment) {
      this.leaveSummary = this.userDetails?.leaveAssignment;
      this.totalLeaveDays = this.leaveSummary.reduce((n, {noOfLeaveDays}) => n + noOfLeaveDays, 0);
      this.leaveDaysUsed = this.leaveSummary.reduce((n, {daysUsed}) => n + daysUsed, 0);
      console.log(this.leaveSummary);
      this.leaveBreakdown = this.leaveSummary.map((item, index) => {
        let data = {
          id: index + 1,
          daysUsed: item.daysUsed,
          totalDays: item.noOfLeaveDays,
          name: item.leaveName,
          colorDark: this.leaveAttr[index].colorDark,
          colorLight: this.leaveAttr[index].colorLight,
          icon: this.leaveAttr[index].icon
        }
        return data;
      });
      console.log(this.leaveSummary);
    }

    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);

    this.leaveRequestFields = [
      {
        controlName: 'leaveType',
        controlType: 'select',
        controlLabel: 'Leave Type',
        controlWidth: '100%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.userDetails.leaveAssignment, 'leaveName'),
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'startDate',
        controlType: 'date',
        controlLabel: 'Start Date',
        controlWidth: '48%',
        initialValue: '',
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'endDate',
        controlType: 'date',
        controlLabel: 'End Date',
        controlWidth: '48%',
        initialValue: '',
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'message',
        controlType: 'textarea',
        controlLabel: 'Message',
        controlWidth: '100%',
        initialValue: null,
        validators: [Validators.required],
        order: 4
      },
    ]

    this.leaveRequestFields.sort((a,b) => (a.order - b.order));
    this.leaveForm = this.fb.group({})

    this.leaveRequestFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.leaveForm.addControl(field.controlName, formControl)
    })
  }

  getPageData = async () => {
    this.leaveRecords = await this.hrService.getLeaveRequests().toPromise();
    this.dataSource = new MatTableDataSource(this.leaveRecords['data']);

    console.log(this.leaveRecords);
  }

  //Converts an array to an Object of key value pairs
  arrayToObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['leaveTypeId']] = item[key];
      return agg;
    }, {})

    console.log(reqObj)
    return reqObj;
  }

  // createLeaveRequest() {
  //   if(this.leaveForm.valid) {
  //     let data = {
  //       leaveTypeId: this.leaveForm.value.leaveType,
  //       leaveStartDate: this.leaveForm.value.startDate,
  //       leaveEndDate: this.leaveForm.value.endDate,
  //       requestMessage: this.leaveForm.value.message
  //     }
  //     console.log(data);
  //     this.hrService.createLeaveRequest(data).subscribe({
  //       next: res => {
  //         console.log(res);
  //         if(res.status == 200) {
  //           this.notifyService.showSuccess('You leave application has been sent successfully');
  //           this.getPageData();
  //         }
  //       },
  //       error: err => {
  //         console.log(err)
  //         this.notifyService.showError(err.error.error);
  //       } 
  //     })
  //   }
  // }

  createLeaveRequest() {
    this.dialog.open(LeaveReviewComponent, {
      width: '35%',
      height: 'auto',
      data: {
        isExisting: false,
        leaveTypes: this.leaveSummary, 
        forApproval: false
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  editLeaveRequest(details: any) {
    this.dialog.open(LeaveReviewComponent, {
      width: '30%',
      height: 'auto',
      data: {
        id: details._id,
        isExisting: true,
        modalInfo: details,
        leaveTypes: this.leaveSummary, 
        forApproval: false
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  //Delete a leave request
  deleteLeaveRequest(info: any) {
    this.notifyService.confirmAction({
      title: 'Delete Leave Request',
      message: 'Are you sure you want to delete this leave request?',
      confirmText: 'Delete Request',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteLeaveRequest(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('This leave request has been deleted successfully');
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

  // strToDate(dateVal: string, key:string) {
  //   if(key == 'requestDate') {
  //     let newFormat = new Date(dateVal);
  //     // console.log(newFormat.toDateString());
  //     return this.datePipe.transform(newFormat, 'd MMMM, y')
  //   }
  //   else if(key = 'summary') {
  //     const [day, month, year] = dateVal.split('-');
  //     let newFormat = new Date(+year, +month - 1, +day);
  //     // console.log(newFormat.toDateString());
  //     return this.datePipe.transform(newFormat, 'd MMMM, y')
  //   }
  //   else {
  //     let newFormat = new Date(dateVal);
  //     // console.log(newFormat.toDateString());
  //     return this.datePipe.transform(newFormat, 'd MMMM, y')
  //   }    
  // }

  strToDate(dateVal: string) {
    let reqDate:any = new Date(dateVal)
    if(reqDate == 'Invalid Date') {
      const [day, month, year] = dateVal.split('-');
      let newFormat = new Date(+year, +month - 1, +day);
      reqDate = newFormat;
    }
    return reqDate;
  }

  convertToDate(dateStr: string) {
    return new Date(dateStr)
  }

}
