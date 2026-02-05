import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { SharedService } from 'src/app/shared/services/utils/shared.service';
import { CreateKpiGroupComponent } from '../create-kpi-group/create-kpi-group.component';
import { CreateKpiComponent } from '../create-kpi/create-kpi.component';


@Component({
  selector: 'app-appraisal-kpis',
  templateUrl: './appraisal-kpis.component.html',
  styleUrls: ['./appraisal-kpis.component.scss']
})
export class AppraisalKpisComponent implements OnInit {
  activeTab:number = -1;
  loggedInUser: any;
  departmentList:any[] = [];
  employees:any[] = [];
  kpiGroups: any[];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthenticationService,
    @Inject(HumanResourcesService) private hrService: HumanResourcesService, 
    @Inject(SharedService) private sharedService: SharedService,     
    @Inject(NotificationService) private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser.data;
    this.getKpiGroups();
    this.getPageData();
  }

  getPageData() {
    const departments$ = this.hrService.getDepartments().subscribe(res => this.departmentList = res.data);
    const employees$ = this.hrService.getEmployees().subscribe(res => this.employees = res.data)       
  }

  getKpiGroups() {
    this.hrService.getKpiGroups().subscribe(res => {
      this.kpiGroups = res.data;
      console.log('KPI Groups', this.kpiGroups)
    })
  }

  // Create a KPI Group
  createKpiGroup() {
    this.dialog.open(CreateKpiGroupComponent, {
      width: '35%',
      height: 'auto',
      data: {
        departments: this.departmentList,
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getKpiGroups();
    });
  }

  // Update a KPI Group
  updateKpiGroup(details) {
    this.dialog.open(CreateKpiGroupComponent, {
      width: '35%',
      height: 'auto',
      data: {
        isExisting: true,
        departments: this.departmentList,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getKpiGroups();
    });
  }

  //Delete a KPI Group
  deleteKpiGroup(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.groupName + ' KPI Group',
      message: 'Are you sure you want to remove this kpi group?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteKpiGroup(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.success) {
              this.getKpiGroups();
              this.notifyService.showInfo('This KPI group has been deleted successfully');
            }
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


  /* KPI Functions */
  
  // Create a KPI
  createKpi(info: any) {
    this.dialog.open(CreateKpiComponent, {
      width: '35%',
      height: 'auto',
      data: {
        groupId: info._id,
        employees: this.employees ? this.employees : [],
        modalInfo: info,
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getKpiGroups();
    });
  }

  // Update a KPI
  updateKpi(details) {
    this.dialog.open(CreateKpiComponent, {
      width: '35%',
      height: 'auto',
      data: {
        groupId: details.kpiGroupId,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getKpiGroups();
    });
  }

  //Delete a KPI
  deleteKpi(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.kpiName + ' KPI',
      message: 'Are you sure you want to remove this kpi?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteKpi(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('This KPI has been deleted successfully');
            }
            this.getKpiGroups();
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
