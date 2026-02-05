import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AceerpDashboardComponent } from './aceerp-dashboard/aceerp-dashboard.component';
import { AceerpLayoutComponent } from './aceerp-layout/aceerp-layout.component';
import { AceerpUsersComponent } from './aceerp-users/aceerp-users.component';
import { AceerpCompanyDetailsComponent } from './aceerp-company-details/aceerp-company-details.component';
import { AceerpSystemModulesComponent } from './aceerp-system-modules/aceerp-system-modules.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'companies',
    pathMatch: 'full'
    //component: EmployeesListComponent
  },
  {
    path: 'dashboard',
    component: AceerpDashboardComponent
  },
  {
    path: 'modules',
    component: AceerpSystemModulesComponent
  },
  {
    path: 'companies',
    component: AceerpUsersComponent
  },
  {
    path: 'companies/:id',
    component: AceerpCompanyDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AceerpRoutingModule { }
