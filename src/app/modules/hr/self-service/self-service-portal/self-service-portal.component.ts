import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-self-service-portal',
  templateUrl: './self-service-portal.component.html',
  styleUrls: ['./self-service-portal.component.scss']
})
export class SelfServicePortalComponent implements OnInit {

  tabMenu = [
    {
      routeLink: 'overview',
      label: 'Overview',
    },
    {
      routeLink: 'payroll',
      label: 'Payroll',
    },
    {
      routeLink: 'leave-requests',
      label: 'Leave Requests',
    },
    {
      routeLink: 'reimbursement',
      label: 'Reimbursement',
    },
    {
      routeLink: 'appraisals',
      label: 'Appraisals',
    },

    {
      routeLink: 'visitor',
      label: "Visitor's Log",
    },
    {
      routeLink: 'induction',
      label: 'Induction',
    }

  ]

  constructor() { }

  ngOnInit(): void {
  }

}
