import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recruitment-portal',
  templateUrl: './recruitment-portal.component.html',
  styleUrls: ['./recruitment-portal.component.scss']
})
export class RecruitmentPortalComponent implements OnInit {

  tabMenu = [
    {
      routeLink: 'overview',
      label: 'Overview',
    },
    {
      routeLink: 'job-board',
      label: 'Job Board',
    },
    {
      routeLink: 'applicant-screening',
      label: 'Applicant Screening',
    },
    {
      routeLink: 'onboarding',
      label: 'Onboarding',
    }

  ]

  constructor() { }

  ngOnInit(): void {
  }

}
