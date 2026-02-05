import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralSettingsComponent } from './general/general-settings/general-settings.component';
import { HumanResourcesSettingsComponent } from './human-resources/human-resources-settings/human-resources-settings.component';
import { AccountSettingsPortalComponent } from './general/account-settings-portal/account-settings-portal.component';
import { SubscriptionHistoryComponent } from './general/subscriptions/subscription-history/subscription-history.component';
import { SubscriptionOverviewComponent } from './general/subscriptions/subscription-overview/subscription-overview.component';
import { AuditTrailComponent } from './general/audit-trail/audit-trail.component';
import { BillingOverviewComponent } from './general/billing/billing-overview/billing-overview.component';
import { RolesPermissionsManagementComponent } from './general/roles-permissions/roles-permissions-management/roles-permissions-management.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'general-settings',
    pathMatch: 'full'
    //component: EmployeesListComponent
  },
  {
    path: 'general-settings',
    component: AccountSettingsPortalComponent,
    children: [
      {
        path: '',
        redirectTo: 'account-info',
        pathMatch: 'full'
      },
      {
        path : 'account-info',
        component: GeneralSettingsComponent
      },
      {
        path : 'roles-permissions',
        component: RolesPermissionsManagementComponent
      },
      {
        path : 'subscription/history',
        component: SubscriptionHistoryComponent
      },
      {
        path : 'subscription/plans',
        component: SubscriptionOverviewComponent
      },
      {
        path : 'audit-trails',
        component: AuditTrailComponent
      },
      {
        path : 'billing',
        component: BillingOverviewComponent
      },
    ]
  },
  {
    path: 'human-resources-settings',
    component: HumanResourcesSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
