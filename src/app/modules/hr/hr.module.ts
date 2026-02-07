import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { HrRoutingModule } from './hr-routing.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AutosizeModule } from 'ngx-autosize';
import { NgxGaugeModule } from 'ngx-gauge';
// import { SlickCarouselModule } from 'ngx-slick-carousel';
import { EmployeesListComponent } from './employees/employees-list/employees-list.component';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeDetailsComponent } from './employees/employee-info/employee-details/employee-details.component';
import { SelfServicePortalComponent } from './self-service/self-service-portal/self-service-portal.component';
import { SelfServiceLeaveRequestsComponent } from './self-service/self-service-leave-requests/self-service-leave-requests.component';
import { SelfServicePayrollComponent } from './self-service/self-service-payroll/self-service-payroll.component';
import { SelfServiceReimbursementComponent } from './self-service/self-service-reimbursement/self-service-reimbursement.component';
import { SelfServiceOverviewComponent } from './self-service/self-service-overview/self-service-overview.component';
import { PayrollSummaryComponent } from './payroll/payroll-summary/payroll-summary.component';
import { RecruitmentOverviewComponent } from './recruitment/recruitment-overview/recruitment-overview.component';
import { RecruitmentJobBoardComponent } from './recruitment/recruitment-job-board/recruitment-job-board.component';
import { RecruitmentPortalComponent } from './recruitment/recruitment-portal/recruitment-portal.component';
import { RecruitmentScreeningComponent } from './recruitment/recruitment-screening/recruitment-screening.component';
import { RecruitmentOnboardingComponent } from './recruitment/recruitment-onboarding/recruitment-onboarding.component';
import { VisitorsLogComponent } from './visitors-log/visitors-log/visitors-log.component';
import { GeneralAppraisalComponent } from './appraisals/general-appraisal/general-appraisal.component';
import { LeaveManagementOverviewComponent } from './leave-management/leave-management-overview/leave-management-overview.component';
import { LeaveReviewComponent } from './leave-management/leave-review/leave-review.component';
import { BulkUploadComponent } from './employees/bulk-upload/bulk-upload.component';
import { EditEmployeeComponent } from './employees/edit-employee/edit-employee.component';
import { CreateKpiGroupComponent } from './appraisals/create-kpi-group/create-kpi-group.component';
import { CreateKpiComponent } from './appraisals/create-kpi/create-kpi.component';
import { CreateAppraisalPeriodComponent } from './appraisals/create-appraisal-period/create-appraisal-period.component';
import { AppraisalFormComponent } from './appraisals/appraisal-form/appraisal-form.component';
import { CreateRatingScaleComponent } from './appraisals/create-rating-scale/create-rating-scale.component';
import { PayrollDetailsComponent } from './payroll/payroll-details/payroll-details.component';
import { PayrollUploadComponent } from './payroll/payroll-upload/payroll-upload.component';
import { ExpenseManagementComponent } from './expense-management/expense-management/expense-management.component';
import { ExpenseRequestReviewComponent } from './expense-management/expense-request-review/expense-request-review.component';
import { PayrollPortalComponent } from './payroll/payroll-portal/payroll-portal.component';
import { PayrollPeriodDetailsComponent } from './payroll/payroll-period-details/payroll-period-details.component';
import { PayrollCalculatorComponent } from './payroll/payroll-calculator/payroll-calculator.component';
import { AssignManagerApproversComponent } from './employees/assign-manager-approvers/assign-manager-approvers.component';
import { PayslipComponent } from './payroll/payslip/payslip.component';
import { CalendarComponent } from './calendar/calendar/calendar.component';
import { MeetingInfoComponent } from './calendar/meeting-info/meeting-info.component';
import { JobPostInfoComponent } from './recruitment/job-post-info/job-post-info.component';
import { RecruitmentApplicantsComponent } from './recruitment/recruitment-applicants/recruitment-applicants.component';
import { RecruitmentApplicantFormComponent } from './recruitment/recruitment-applicant-form/recruitment-applicant-form.component';
import { AssignSalaryScalesComponent } from './employees/assign-salary-scales/assign-salary-scales.component';
import { EmployeeOverviewComponent } from './employees/employee-overview/employee-overview.component';
import { EmployeePayrollComponent } from './employees/employee-info/employee-payroll/employee-payroll.component';
import { EmployeeAbsenceComponent } from './employees/employee-info/employee-absence/employee-absence.component';
import { EmployeeDocumentsComponent } from './employees/employee-info/employee-documents/employee-documents.component';
import { LeaveAssignmentComponent } from './leave-management/leave-assignment/leave-assignment.component';
import { LmsPortalComponent } from './lms/lms-portal/lms-portal.component';
import { LmsOverviewComponent } from './lms/lms-overview/lms-overview.component';
import { CourseCardComponent } from './lms/course-card/course-card.component';
import { CourseInfoComponent } from './lms/course-info/course-info.component';
import { CourseDetailsComponent } from './lms/course-details/course-details.component';
import { AssessmentInfoComponent } from './lms/assessment-info/assessment-info.component';
import { AssessmentPageComponent } from './lms/assessment-page/assessment-page.component';
import { CoursesListComponent } from './lms/courses-list/courses-list.component';
import { CourseCategoryInfoComponent } from './lms/course-category-info/course-category-info.component';
import { AssessmentListComponent } from './lms/assessment-list/assessment-list.component';
import { AssessmentGradesComponent } from './lms/assessment-grades/assessment-grades.component';
import { AssessmentCardComponent } from './lms/assessment-card/assessment-card.component';
import { AppraisalPortalComponent } from './appraisals/appraisal-portal/appraisal-portal.component';
import { AppraisalKpisComponent } from './appraisals/appraisal-kpis/appraisal-kpis.component';
import { NoticeInfoComponent } from './notice-board/notice-info/notice-info.component';
import { NoticeListComponent } from './notice-board/notice-list/notice-list.component';
import { ReportsPortalComponent } from './reports/reports-portal/reports-portal.component';
import { ReportsDashboardComponent } from './reports/reports-dashboard/reports-dashboard.component';
import { ReportsGenerationComponent } from './reports/reports-generation/reports-generation.component';
import { EmployeeReportsComponent } from './reports/employee-reports/employee-reports.component';
import { AbsenceReportsComponent } from './reports/absence-reports/absence-reports.component';
import { PayrollReportsComponent } from './reports/payroll-reports/payroll-reports.component';
import { ExpenseReportsComponent } from './reports/expense-reports/expense-reports.component';
import { AppraisalReportsComponent } from './reports/appraisal-reports/appraisal-reports.component';


@NgModule({
  declarations: [
    EmployeesListComponent, 
    EmployeeDetailsComponent, 
    SelfServicePortalComponent, 
    SelfServiceLeaveRequestsComponent, 
    SelfServicePayrollComponent, 
    LeaveReviewComponent,
    SelfServiceReimbursementComponent, 
    SelfServiceOverviewComponent, 
    PayrollSummaryComponent, 
    RecruitmentOverviewComponent, 
    RecruitmentJobBoardComponent, 
    RecruitmentPortalComponent, 
    RecruitmentScreeningComponent, 
    RecruitmentOnboardingComponent, 
    VisitorsLogComponent, 
    GeneralAppraisalComponent, 
    LeaveManagementOverviewComponent, 
    BulkUploadComponent, 
    EditEmployeeComponent, 
    CreateKpiGroupComponent, 
    CreateKpiComponent, 
    CreateAppraisalPeriodComponent, 
    AppraisalFormComponent, 
    CreateRatingScaleComponent, 
    PayrollDetailsComponent, 
    PayrollUploadComponent, 
    ExpenseManagementComponent, 
    ExpenseRequestReviewComponent, 
    PayrollPortalComponent, 
    PayrollPeriodDetailsComponent, 
    PayrollCalculatorComponent, 
    AssignManagerApproversComponent, 
    PayslipComponent, 
    CalendarComponent, 
    MeetingInfoComponent, 
    JobPostInfoComponent, 
    RecruitmentApplicantsComponent, 
    RecruitmentApplicantFormComponent, 
    AssignSalaryScalesComponent, 
    EmployeeOverviewComponent, 
    EmployeePayrollComponent, 
    EmployeeAbsenceComponent, 
    EmployeeDocumentsComponent, 
    LeaveAssignmentComponent,
    LmsPortalComponent,
    LmsOverviewComponent,
    CourseCardComponent,
    CourseInfoComponent,
    CourseDetailsComponent,
    AssessmentInfoComponent,
    AssessmentPageComponent,
    CoursesListComponent,
    CourseCategoryInfoComponent,
    AssessmentListComponent,
    AssessmentGradesComponent,
    AssessmentCardComponent,
    AppraisalPortalComponent,
    AppraisalKpisComponent,
    NoticeInfoComponent,
    NoticeListComponent,
    ReportsPortalComponent,
    ReportsDashboardComponent,
    ReportsGenerationComponent,
    EmployeeReportsComponent,
    AbsenceReportsComponent,
    PayrollReportsComponent,
    ExpenseReportsComponent,
    AppraisalReportsComponent
  ],
  imports: [
    CommonModule,
    NgxGaugeModule,
    HrRoutingModule,
    SharedModule,
    HighchartsChartModule,
    NgbModalModule,
    NgxMaterialTimepickerModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    AutosizeModule
  ],
  exports: [
    LeaveReviewComponent
  ]
})
export class HrModule { }
