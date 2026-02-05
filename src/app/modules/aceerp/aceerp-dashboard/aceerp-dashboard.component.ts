import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import * as Highcharts from 'highcharts';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { SharedService } from 'src/app/shared/services/utils/shared.service';
import { AceerpService } from 'src/app/shared/services/aceerp/aceerp.service';

@Component({
  selector: 'app-aceerp-dashboard',
  templateUrl: './aceerp-dashboard.component.html',
  styleUrls: ['./aceerp-dashboard.component.scss']
})
export class AceerpDashboardComponent implements OnInit {

  usersList: any[] = [];

  constructor(
    public dialog: MatDialog,
    private route: Router,
    private datePipe: DatePipe,
    private authService: AuthenticationService,
    private hrService: HumanResourcesService, 
    private aceerpService: AceerpService,    
    private notifyService: NotificationService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.getPageData()
  }

  getPageData = async () => {
    this.usersList = await this.aceerpService.getAllUsers().toPromise();
    console.log(this.usersList);
  }

}
