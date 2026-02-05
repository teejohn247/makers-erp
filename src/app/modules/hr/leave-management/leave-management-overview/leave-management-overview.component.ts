import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveRequestTable } from 'src/app/shared/models/leave-requests';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { LeaveReviewComponent } from '../leave-review/leave-review.component';

@Component({
  selector: 'app-leave-management-overview',
  templateUrl: './leave-management-overview.component.html',
  styleUrls: ['./leave-management-overview.component.scss']
})
export class LeaveManagementOverviewComponent implements OnInit {

  displayedColumns: any[];
  requestedApprovals: any[];
  approvedRequests: any[] = [];
  leaveTypeList: any[] = [];
  leaveGraphDetails:any;
  dataSource: MatTableDataSource<LeaveRequestTable>;
  selection = new SelectionModel<LeaveRequestTable>(true, []);

  requestMatrix = [
    {
      id: 1,
      label: "21+",
      key: "21+ days",
    },
    {
      id: 2,
      label: "15-21",
      key: "15-21 days",
    },
    {
      id: 3,
      label: "8-14",
      key: "8-14 days",
    },
    {
      id: 4,
      label: "0-7",
      key: "0-7 days",
    },
  ]

  //Leave Request Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "select",
      label: "Select",
      order: 1,
      columnWidth: "2%",
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
      key: "fullName",
      label: "Name",
      order: 2,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "leaveTypeName",
      label: "Absence Type",
      order: 3,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "requestDate",
      label: "Date Submitted",
      order: 8,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "leaveStartDate",
      label: "Start Date",
      order: 4,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "leaveEndDate",
      label: "End Date",
      order: 5,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    // {
    //   key: "approver",
    //   label: "Approver",
    //   order: 6,
    //   columnWidth: "12%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    {
      key: "status",
      label: "Status",
      order: 9,
      columnWidth: "8%",
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

  tableData: LeaveRequestTable[] = []

  constructor(
    private hrService: HumanResourcesService,
    private notifyService: NotificationService,     
    private datePipe: DatePipe,
    public dialog: MatDialog,
  ) {
    this.getPageData();
  }

  ngOnInit(): void {
    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.dataSource = new MatTableDataSource(this.tableData)
    this.getRequestedApprovals();
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

  getPageData = async () => {
    this.leaveTypeList = await this.hrService.getLeaveTypes().toPromise();
    // this.employeeList = await this.hrService.getEmployees().toPromise();
    // console.log(this.employeeList);

    const leaveGraph$ = this.hrService.getLeaveGraph(2025).subscribe(res => {
      this.leaveGraphDetails = res.data;
      console.log(this.leaveGraphDetails);
      this.leaveGraphDetails.forEach(row => {
        this.requestMatrix.find(x => {
          if(x.key == row.group) x['staff'] = row.employees;
        }) 
      });
      console.log('Matrix', this.requestMatrix)
    })
  }

  getRequestedApprovals() {
    this.hrService.getRequestedLeaveApprovals().subscribe(res => {
      this.requestedApprovals = res.data;
      console.log(res);
      this.dataSource = new MatTableDataSource(this.requestedApprovals);
      this.approvedRequests = this.requestedApprovals.filter(item => {
        return item.status === 'Approved';
      })    
      console.log(this.approvedRequests);
    })
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
  //     return this.datePipe.transform(newFormat, 'MMM d, y')
  //   }
  //   else {
  //     const [day, month, year] = dateVal.split('-');
  //     let newFormat = new Date(+year, +month - 1, +day);
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

  actionRequest(details: any) {
    this.dialog.open(LeaveReviewComponent, {
      width: '40%',
      height: 'auto',
      data: {
        id: details._id,
        isExisting: true,
        modalInfo: details,
        forApproval: true
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

}
