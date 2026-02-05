import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AceerpRoutingModule } from './aceerp-routing.module';
import { AceerpDashboardComponent } from './aceerp-dashboard/aceerp-dashboard.component';
import { AceerpLayoutComponent } from './aceerp-layout/aceerp-layout.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AceerpUsersComponent } from './aceerp-users/aceerp-users.component';
import { AceerpCompanyInfoComponent } from './aceerp-company-info/aceerp-company-info.component';
import { AceerpSubscriptionActivationComponent } from './aceerp-subscription-activation/aceerp-subscription-activation.component';
import { AceerpCompanyDetailsComponent } from './aceerp-company-details/aceerp-company-details.component';
import { AceerpPermissionInfoComponent } from './aceerp-permission-info/aceerp-permission-info.component';
import { AceerpRoleInfoComponent } from './aceerp-role-info/aceerp-role-info.component';
import { AceerpSystemModulesComponent } from './aceerp-system-modules/aceerp-system-modules.component';


@NgModule({
  declarations: [
    AceerpDashboardComponent,
    AceerpLayoutComponent,
    AceerpUsersComponent,
    AceerpCompanyInfoComponent,
    AceerpSubscriptionActivationComponent,
    AceerpCompanyDetailsComponent,
    AceerpPermissionInfoComponent,
    AceerpRoleInfoComponent,
    AceerpSystemModulesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AceerpRoutingModule,
  ]
})
export class AceerpModule { }
