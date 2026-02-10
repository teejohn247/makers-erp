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
import { BranchInfoComponent } from '../branch-info/branch-info.component';

@Component({
  selector: 'app-branches-overview',
  templateUrl: './branches-overview.component.html',
  styleUrls: ['./branches-overview.component.scss']
})
export class BranchesOverviewComponent implements OnInit {

  employees: any[] = [];
  branchList: any[] = [];
  displayedColumns: any[];
  dataSource: MatTableDataSource<any>;

  //Department Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "branchName",
      label: "Branch Name",
      order: 1,
      columnWidth: "20%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "managerName",
      label: "Manager",
      order: 2,
      columnWidth: "20%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "createdAt",
      label: "Date Created",
      order: 2,
      columnWidth: "20%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "noOfEmployees",
      label: "Employee Count",
      order: 3,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "city",
      label: "Location",
      order: 3,
      columnWidth: "20%",
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
    public dialog: MatDialog,
    private route: Router,
    private datePipe: DatePipe,
    @Inject(HumanResourcesService) private hrService: HumanResourcesService, 
    @Inject(SharedService) private sharedService: SharedService,     
    @Inject(NotificationService) private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    const employees$ = this.hrService.getEmployees().subscribe((res:any) => {
      this.employees = res.data;
    });
    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.getBranches();
  }


  /*************** Branches RELATED ACTIONS ***************/
  
  //Get all Branches
  getBranches() {
    this.hrService.getBranches().subscribe({
      next: (res:any) => {
        this.branchList =  res.data ?? [] ;
        console.log(this.branchList)
        this.dataSource = new MatTableDataSource(this.branchList);
      },
      error: err => {
        this.branchList = [];
        console.log(this.branchList)
      }
    });
  }
  
  //Create a new branch
  createBranch() {
    this.dialog.open(BranchInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        name: '',
        staff: this.employees,
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getBranches();
    });
  }

  //Edit a branch
  editBranch(details: any) {
    this.dialog.open(BranchInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        name: details.branchName,
        id: details._id,
        isExisting: true,
        modalInfo: details,
        staff: this.employees
      },
    }).afterClosed().subscribe(() => {
      this.getBranches();
    });
  }

  //Delete a branch
  deleteBranch(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.branchName + ' Branch',
      message: 'Are you sure you want to remove this branch?',
      confirmText: 'Remove Branch',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteBranch(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The branch has been deleted successfully');
            }
            this.getBranches();
          },
          error: err => {
            console.log(err)
          } 
        })
      }
    });
  }

}
