import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';

@Component({
  selector: 'app-employee-overview',
  templateUrl: './employee-overview.component.html',
  styleUrls: ['./employee-overview.component.scss']
})
export class EmployeeOverviewComponent implements OnInit {
  employeeId: string;
  employeeDetails:any;
  managerImage:string;
  managerRole:string;

  tabMenu = [
    {
      routeLink: 'personal-info',
      label: 'Personal Information',
    },
    {
      routeLink: 'absence-info',
      label: 'Absence',
    },
    {
      routeLink: 'payroll-info',
      label: 'Payroll',
    },
    // {
    //   routeLink: 'expenses',
    //   label: 'Expenses',
    // },
    // {
    //   routeLink: 'appraisal',
    //   label: 'Appraisal',
    // }
  ]

  constructor(
    private activatedRoute:ActivatedRoute, 
    private location: Location,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.employeeId=this.activatedRoute.snapshot.params["id"];

    const employeeInfo$ = this.hrService.getEmployeeDetails(this.employeeId)
    employeeInfo$.subscribe(res => {
      this.employeeDetails = res.data;
      console.log(this.employeeDetails)
      this.getManagerImg(this.employeeDetails.managerId)
    })
    //console.log(this.employeeId)
  }

  goBack() {
    this.location.back();
  }

  strToDate(dateVal: string) {
    let reqDate:any = new Date(dateVal)
    if(reqDate == 'Invalid Date') {
      const [day, month, year] = dateVal.split('-');
      let newFormat = new Date(+year, +month - 1, +day);
      reqDate = newFormat;
    }
    return reqDate;
  }

  getManagerImg(id:string) {
    this.hrService.getEmployeeDetails(id).subscribe(res => {
      this.managerImage = res.data.profilePic;
      this.managerRole = res.data.companyRole;
    })
  }

}
