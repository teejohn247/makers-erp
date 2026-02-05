import { Component, OnInit } from '@angular/core';
import { Options } from 'highcharts';
import * as Highcharts from 'highcharts';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { MatTableDataSource } from '@angular/material/table';
import { JobPostTable } from 'src/app/shared/models/job-data';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { DatePipe } from '@angular/common';
import { JobPostInfoComponent } from '../job-post-info/job-post-info.component';

@Component({
  selector: 'app-recruitment-overview',
  templateUrl: './recruitment-overview.component.html',
  styleUrls: ['./recruitment-overview.component.scss']
})
export class RecruitmentOverviewComponent implements OnInit {

  employeeList: any[] = [];
  departmentList: any[] = [];
  jobRoles: any[] = [];
  displayedColumns: any[];
  dataSource: MatTableDataSource<JobPostTable>;

  jobPostSummary: any[] = [
    {
      id: 1,
      count: 4,
      name: "Active Job Posts",
      colorDark: "rgba(29, 161, 242, 1)",
      colorLight: "rgba(66, 133, 244, 0.2)",
      icon: "bi bi-signpost-2-fill"
    },
    {
      id: 2,
      count: 145,
      name: "Total Applicants",
      colorDark: "rgba(255,154,77, 1)",
      colorLight: "rgba(66, 133, 244, 0.2)",
      icon: "bi bi-people-fill"
    },
    {
      id: 3,
      count: 5,
      name: "Hired Candidates",
      colorDark: "rgba(54, 171, 104, 1)",
      colorLight: "rgba(66, 133, 244, 0.2)",
      icon: "bi bi-award-fill"
    }
  ]

  //Leave Request Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "jobTitle",
      label: "Job Title",
      order: 1,
      columnWidth: "18%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "departmentName",
      label: "Department",
      order: 2,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "openingDate",
      label: "Opening Date",
      order: 3,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "closingDate",
      label: "Closing Date",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "applicants",
      label: "Applicants",
      order: 5,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "jobType",
      label: "Job Type",
      order: 6,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "hiringManager",
      label: "Hiring Manager",
      order: 7,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      order: 8,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "actions",
      label: "Actions",
      order: 9,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    }

  ]

  tableData: JobPostTable[] = [
    // {
    //   id: 1,
    //   "Job ID": "MARK-2045",
    //   "Job Title": "Marketing Analyst",
    //   "Department": "Marketing",
    //   "Applicants": 45,
    //   "Job Type": "Full Time",
    //   "Opening Date": "Feb 11, 2023",
    //   "Closing Date": "Feb 27, 2023",
    //   "Hiring Manager": "Simon Dowen",
    //   "Status": "Expired"
    // },
    // {
    //   id: 2,
    //   "Job ID": "TECH-3445",
    //   "Job Title": "Senior Analyst",
    //   "Department": "Technology",
    //   "Applicants": 89,
    //   "Job Type": "Contract",
    //   "Opening Date": "Mar 24, 2023",
    //   "Closing Date": "April 27, 2023",
    //   "Hiring Manager": "Chris Joyles",
    //   "Status": "Active"
    // },
    // {
    //   id: 3,
    //   "Job ID": "HR-5645",
    //   "Job Title": "HR Consultant",
    //   "Department": "Human Resources",
    //   "Applicants": 23,
    //   "Job Type": "Full Time",
    //   "Opening Date": "July 11, 2023",
    //   "Closing Date": "July 15, 2023",
    //   "Hiring Manager": "Simon Dowen",
    //   "Status": "Active"
    // },
    // {
    //   id: 4,
    //   "Job ID": "ACC-3445",
    //   "Job Title": "Finance Officer",
    //   "Department": "Accounts",
    //   "Applicants": 45,
    //   "Job Type": "Part Time",
    //   "Opening Date": "Sep 12, 2023",
    //   "Closing Date": "Sep 14, 2023",
    //   "Hiring Manager": "Simon Dowen",
    //   "Status": "Expired"
    // },
  ]

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Options = {
    chart: {
      type: 'pie',
      plotShadow: false
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      pie: {
        innerSize: '99%',
        borderWidth: 20,
        borderColor: null,
        slicedOffset: 5,
        dataLabels: {
          connectorWidth: 0,
          enabled: false
        }
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px; letter-spacing: 0.03rem; font-family: Roboto">{series.name}</span><br>',
      pointFormat: '<span style="font-size:11px; letter-spacing: 0.03rem; font-family: Roboto; color:{point.color}">{point.name}</span>: <b>{point.value} Candidates</b> <br/>'
    },
    title: {
      verticalAlign: 'middle',
      floating: false,
      text: ''
    },
    legend: {
      enabled: true
    },
    series: [
      {
        type: 'pie',
        name: 'No of Candidates',
        data: [
          { name: 'Marketing', y: 10, value: 21, color: '#36ab68' },
          { name: 'Human Resources', y: 20, value: 14, color: '#a9bf3c' },
          { name: 'Technology', y: 45, value: 85, color: '#a336ab' },
          { name: 'Accounts', y: 25, value: 32, color: '#f08585' },
        ]
      }
    ]
  }

  constructor(
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.getPageData();
    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
  }

  getPageData = async () => {
    this.employeeList = await this.hrService.getEmployees().toPromise();
    this.departmentList = await this.hrService.getDepartments().toPromise();
    this.jobRoles = await this.hrService.getJobRoles().toPromise();
    console.log(this.jobRoles['data']);

    this.dataSource = new MatTableDataSource(this.jobRoles['data']);
    // this.designationList = await this.hrService.getDesignations().toPromise();
    // this.dataSource.sort = this.sort;
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

  strToDate(dateVal: string, key:string) {
    if(key == 'date') {
      let newFormat = new Date(dateVal);
      // console.log(newFormat.toDateString());
      return this.datePipe.transform(newFormat, 'd MMMM, y')
    }
    else if(key = 'checked') {
      let newFormat = new Date(dateVal);
      // console.log(newFormat.toDateString());
      return this.datePipe.transform(newFormat, 'shortTime')
    }
  }

}
