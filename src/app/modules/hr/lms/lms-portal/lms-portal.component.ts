import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';

@Component({
  selector: 'app-lms-portal',
  templateUrl: './lms-portal.component.html',
  styleUrls: ['./lms-portal.component.scss']
})
export class LmsPortalComponent implements OnInit {
  loggedInUser: any;

  tabMenu = [
    {
      routeLink: 'overview',
      label: 'Overview',
    },
    {
      routeLink: 'courses',
      label: 'Courses',
    },
  ]

  constructor(
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser.data;
    if(this.loggedInUser.isSuperAdmin) this.tabMenu.push({
      routeLink: 'assessments',
      label: 'Assessments',
    })
  }

}
