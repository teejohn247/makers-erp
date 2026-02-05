import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { DatePipe } from '@angular/common';
import { JobPostInfoComponent } from '../job-post-info/job-post-info.component';

@Component({
  selector: 'app-recruitment-job-board',
  templateUrl: './recruitment-job-board.component.html',
  styleUrls: ['./recruitment-job-board.component.scss']
})
export class RecruitmentJobBoardComponent implements OnInit {
  jobRoles: any[] = [];
  employeeList: any[] = [];
  departmentList: any[] = [];

  jobPosts = [
    {
      id: 1,
      jobId: "MARK-2045",
      jobTitle: "Marketing Analyst",
      department: "Marketing",
      applicants: 45,
      shortlisted: 30,
      interviews: 10,
      selected: 2,
      jobType: "Full Time",
      openingDate: "Feb 11, 2023",
      closingDate: "Feb 27, 2023",
      hiringManager: "Simon Dowen",
      status: "Expired"
    },
    {
      id: 2,
      jobId: "TECH-3445",
      jobTitle: "Senior Analyst",
      department: "Technology",
      applicants: 89,
      shortlisted: 60,
      interviews: 32,
      selected: 5,
      jobType: "Contract",
      openingDate: "Mar 24, 2023",
      closingDate: "April 27, 2023",
      hiringManager: "Chris Joyles",
      status: "Active"
    },
    {
      id: 3,
      jobId: "HR-5645",
      jobTitle: "HR Consultant",
      department: "Human Resources",
      applicants: 23,
      shortlisted: 15,
      interviews: 7,
      selected: 1,
      jobType: "Full Time",
      openingDate: "July 11, 2023",
      closingDate: "July 15, 2023",
      hiringManager: "Simon Dowen",
      status: "Active"
    },
    {
      id: 4,
      jobId: "ACC-3445",
      jobTitle: "Finance Officer",
      department: "Accounts",
      applicants: 45,
      shortlisted: 22,
      interviews: 10,
      selected: 1,
      jobType: "Part Time",
      openingDate: "Sep 12, 2023",
      closingDate: "Sep 14, 2023",
      hiringManager: "Simon Dowen",
      status: "Expired"
    },
  ]

  constructor(
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.getPageData();
  }

  getPageData = async () => {
    this.jobRoles = await this.hrService.getJobRoles().toPromise();
    this.employeeList = await this.hrService.getEmployees().toPromise();
    this.departmentList = await this.hrService.getDepartments().toPromise();
  }

  addNewJobPost() {
    const dialogRef = this.dialog.open(JobPostInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        isExisting: false,
        employeeList: this.employeeList['data'],
        departmentList: this.departmentList['data'],
      },
    });
  }

}
