import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { GeneralSettingsComponent } from './general/general-settings/general-settings.component';
import { SelectSystemRolesComponent } from './general/select-system-roles/select-system-roles.component';
import { HumanResourcesSettingsComponent } from './human-resources/human-resources-settings/human-resources-settings.component';
import { DesignationInfoComponent } from './human-resources/designations/designation-info/designation-info.component';
import { LeaveTypeInfoComponent } from './human-resources/absence/leave-type-info/leave-type-info.component';
import { DepartmentInfoComponent } from './human-resources/departments/department-info/department-info.component';
import { PayrollDebitInfoComponent } from './human-resources/payroll/payroll-debit-info/payroll-debit-info.component';
import { PayrollCreditInfoComponent } from './human-resources/payroll/payroll-credit-info/payroll-credit-info.component';
import { ExpenseTypeInfoComponent } from './human-resources/expenses/expense-type-info/expense-type-info.component';
import { PublicHolidayInfoComponent } from './human-resources/absence/public-holiday-info/public-holiday-info.component';
import { DepartmentsOverviewComponent } from './human-resources/departments/departments-overview/departments-overview.component';
import { AbsenceOverviewComponent } from './human-resources/absence/absence-overview/absence-overview.component';
import { DesignationsOverviewComponent } from './human-resources/designations/designations-overview/designations-overview.component';
import { ExpensesOverviewComponent } from './human-resources/expenses/expenses-overview/expenses-overview.component';
import { PayrollOverviewComponent } from './human-resources/payroll/payroll-overview/payroll-overview.component';
import { AppraisalOverviewComponent } from './human-resources/appraisals/appraisal-overview/appraisal-overview.component';
import { SalaryScaleInfoComponent } from './human-resources/payroll/salary-scale-info/salary-scale-info.component';
import { AccountSettingsPortalComponent } from './general/account-settings-portal/account-settings-portal.component';
import { AuditTrailComponent } from './general/audit-trail/audit-trail.component';
import { SubscriptionOverviewComponent } from './general/subscriptions/subscription-overview/subscription-overview.component';
import { SubscriptionHistoryComponent } from './general/subscriptions/subscription-history/subscription-history.component';
import { RolesPermissionsManagementComponent } from './general/roles-permissions/roles-permissions-management/roles-permissions-management.component';
import { RolesPermissionsOverviewComponent } from './general/roles-permissions/roles-permissions-overview/roles-permissions-overview.component';
import { BillingOverviewComponent } from './general/billing/billing-overview/billing-overview.component';
import { BranchesOverviewComponent } from './human-resources/branches/branches-overview/branches-overview.component';
import { BranchInfoComponent } from './human-resources/branches/branch-info/branch-info.component';


@NgModule({
  declarations: [
    GeneralSettingsComponent,
    SelectSystemRolesComponent,
    HumanResourcesSettingsComponent,
    DesignationInfoComponent,
    LeaveTypeInfoComponent,
    DepartmentInfoComponent,
    PayrollDebitInfoComponent,
    PayrollCreditInfoComponent,
    ExpenseTypeInfoComponent,
    PublicHolidayInfoComponent,
    DepartmentsOverviewComponent,
    AbsenceOverviewComponent,
    DesignationsOverviewComponent,
    ExpensesOverviewComponent,
    PayrollOverviewComponent,
    AppraisalOverviewComponent,
    SalaryScaleInfoComponent,
    AccountSettingsPortalComponent,
    AuditTrailComponent,
    SubscriptionOverviewComponent,
    SubscriptionHistoryComponent,
    RolesPermissionsManagementComponent,
    RolesPermissionsOverviewComponent,
    BillingOverviewComponent,
    BranchesOverviewComponent,
    BranchInfoComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule { }
