import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appraisal-portal',
  templateUrl: './appraisal-portal.component.html',
  styleUrls: ['./appraisal-portal.component.scss']
})
export class AppraisalPortalComponent implements OnInit {

  tabMenu = [
    {
      routeLink: 'overview',
      label: 'Overview',
    },
    {
      routeLink: 'appraisal-kpis',
      label: 'Appraisal KPIs',
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
