import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { SharedService } from 'src/app/shared/services/utils/shared.service';
import { DesignationInfoComponent } from '../designations/designation-info/designation-info.component';
import { LeaveTypeInfoComponent } from '../absence/leave-type-info/leave-type-info.component';
import { DepartmentInfoComponent } from '../departments/department-info/department-info.component';
import { PayrollCreditInfoComponent } from '../payroll/payroll-credit-info/payroll-credit-info.component';
import { PayrollDebitInfoComponent } from '../payroll/payroll-debit-info/payroll-debit-info.component';
import { ExpenseTypeInfoComponent } from '../expenses/expense-type-info/expense-type-info.component';
import { PublicHolidayInfoComponent } from '../absence/public-holiday-info/public-holiday-info.component';

@Component({
  selector: 'app-human-resources-settings',
  templateUrl: './human-resources-settings.component.html',
  styleUrls: ['./human-resources-settings.component.scss']
})
export class HumanResourcesSettingsComponent implements OnInit {

  panelOpenState = false;
  accordionItems: any[] = [];
  payrollAccordionItems: any[] = [];

  departmentList: any[] = [];
  companyRoles: any[] = [];
  designationList: any[] = [];
  leaveTypeList: any[] = [];
  publicHolidayList: any[] = [];
  expenseTypeList: any[] = [];
  payrollCreditList: any[] = [];
  payrollDebitList:any[] = [];
  employees: any[] = [];

  hrSettingsForm: FormGroup;

  tabMenu = [
    {
      routeLink: 'departments',
      label: 'Departments',
    },
    {
      routeLink: 'branches',
      label: 'Branches',
    },
    {
      routeLink: 'absence',
      label: 'Absence & Holidays',
    },
    {
      routeLink: 'designations',
      label: 'Designations',
    },
    {
      routeLink: 'payroll',
      label: 'Payroll',
    },
    {
      routeLink: 'expenses',
      label: 'Expense Types',
    },
    // {
    //   routeLink: 'appraisal',
    //   label: 'Appraisal',
    // }
  ]

  constructor(
    public dialog: MatDialog,
    @Inject(HumanResourcesService) private hrService: HumanResourcesService, 
    @Inject(SharedService) private sharedService: SharedService,     
    @Inject(NotificationService) private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.hrSettingsForm = this.fb.group({
      department: [''],
      designation: [''],
      companyRole: [''],
      leaveType: [''],
      holidayName: [''],
      expenseType: [''],
      payrollCredit: [''],
      payrollDebit: ['']
    })
  }

  ngOnInit(): void {
    this.getPageData();
    this.accordionItems = [
      {
        label: "Departments",
        key: "departments",
        list: []
      },
      {
        label: "Designations",
        key: "designations",
        list: []
      },
      {
        label: "Leave Types",
        key: "leaveTypes",
        list: []
      },
      {
        label: "Holidays",
        key: "holidayTypes",
        list: []
      },
      {
        label: "Expense Types",
        key: "expenseTypes",
        list: []
      }
    ]

    this.payrollAccordionItems = [
      {
        label: "Payroll Credits",
        key: "payrollCredits",
        list: []
      },
      {
        label: "Payroll Debits",
        key: "payrollDebits",
        list: []
      }
    ]
  }

  getPageData() {

    const employees$ = this.hrService.getEmployees().subscribe((res:any) => this.employees = res.data);
    // this.getDepartments();
    // this.getDesignations();
    // this.getLeaveTypes();
    // this.getExpenseTypes();
    // this.getPublicHolidays();
    // this.getPayrollCredits();
    // this.getPayrollDebits();
  }

  /*************** DEPARTMENT RELATED ACTIONS ***************/

  //Get all Departments
  getDepartments() {
    this.hrService.getDepartments().subscribe((res:any) => {
      this.departmentList = res.data;
      this.accordionItems.find(x => {
        if(x.key == 'departments') x.list = this.departmentList;
      })
    });
  }
  
  //Create a new department
  createDepartment() {
    this.dialog.open(DepartmentInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: this.hrSettingsForm.value.department ? this.hrSettingsForm.value.department : '',
        staff: this.employees,
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getDepartments();
      this.hrSettingsForm.controls['department'].reset()
    });
  }

  //Edit a department
  editDepartment(details: any) {
    this.dialog.open(DepartmentInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.departmentName,
        id: details._id,
        isExisting: true,
        modalInfo: details,
        staff: this.employees
      },
    }).afterClosed().subscribe(() => {
      this.getDepartments();
    });
  }

  //Delete a department
  deleteDept(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.departmentName + ' Department',
      message: 'Are you sure you want to remove this department?',
      confirmText: 'Remove Department',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteDepartment(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The department has been deleted successfully');
            }
            this.getDepartments();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  /*************** DESIGNATION RELATED ACTIONS ***************/

  //Get all Designations
  getDesignations() {
    this.hrService.getDesignations().subscribe((res:any) => {
      this.designationList = res.data;
      this.accordionItems.find(x => {
        if(x.key == 'designations') x.list = this.designationList;
      })
    });
  }

  //Create a new designation
  createDesignation() {
    this.dialog.open(DesignationInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        name: this.hrSettingsForm.value.designation,
        leaveTypes: this.leaveTypeList,
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getDesignations();
      this.hrSettingsForm.controls['designation'].reset()
    });
  }

  //Edit a designation
  editDesignation(details: any) {
    this.dialog.open(DesignationInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        name: details.designationName,
        id: details._id,
        leaveTypes: this.leaveTypeList,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getDesignations();
    });;
  }

  //Delete a designation
  deleteDesignation(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.designationName + ' Designation',
      message: 'Are you sure you want to remove this designation?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteDesignation(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The designation has been deleted successfully');
            }
            this.getDesignations();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  /*************** LEAVE TYPES RELATED ACTIONS ***************/

  //Get all leave types
  getLeaveTypes() {
    this.hrService.getLeaveTypes().subscribe((res:any) => {
      this.leaveTypeList = res.data;
      this.accordionItems.find(x => {
        if(x.key == 'leaveTypes') x.list = this.leaveTypeList;
      })
    });
  }

  //Create a new leave type
  createLeaveType() {
    this.dialog.open(LeaveTypeInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: this.hrSettingsForm.value.leaveType,
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getLeaveTypes();
      this.hrSettingsForm.controls['leaveType'].reset()
    });
  }

  //Edit a leave type
  editLeaveType(details: any) {
    this.dialog.open(LeaveTypeInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.leaveName,
        id: details._id,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getLeaveTypes();
    });;
  }

  //Delete a leave type
  deleteLeaveType(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.leaveName + ' Leave Type',
      message: 'Are you sure you want to remove this leave type?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteLeaveType(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The leave type has been deleted successfully');
            }
            this.getLeaveTypes();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  /*************** PUBLIC HOLIDAYS RELATED ACTIONS ***************/

  //Get all holidays
  getPublicHolidays() {
    this.hrService.getPublicHolidays().subscribe((res:any) => {
      this.publicHolidayList = res.data;
      this.accordionItems.find(x => {
        if(x.key == 'holidayTypes') x.list = this.publicHolidayList;
      })
    });
  }

  //Create a new public holiday
  createPublicHoliday() {
    this.dialog.open(PublicHolidayInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        name: this.hrSettingsForm.value.holidayName,
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getPublicHolidays();
      this.hrSettingsForm.controls['holidayName'].reset()
    });
  }

  //Edit a public holiday
  editPublicHoliday(details: any) {
    this.dialog.open(PublicHolidayInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        name: details.holidayName,
        id: details._id,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPublicHolidays();
    });;
  }

  //Delete a public holiday
  deletePublicHoliday(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.holidayName + ' Holiday',
      message: 'Are you sure you want to remove this public holiday?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deletePublicHoliday(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The public holiday has been deleted successfully');
            }
            this.getPublicHolidays();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  /*************** EXPENSE TYPES RELATED ACTIONS ***************/

  //Get all expense types
  getExpenseTypes() {
    this.hrService.getExpenseTypes().subscribe((res:any) => {
      this.expenseTypeList = res.data;
      this.accordionItems.find(x => {
        if(x.key == 'expenseTypes') x.list = this.expenseTypeList;
      })
    });
  }

  //Create a new expense type
  createExpenseType() {
    this.dialog.open(ExpenseTypeInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: this.hrSettingsForm.value.expenseType,
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getExpenseTypes();
      this.hrSettingsForm.controls['expenseType'].reset()
    });
  }

  //Edit an expense type
  editExpenseType(details: any) {
    this.dialog.open(ExpenseTypeInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.expenseName,
        id: details._id,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getExpenseTypes();
    });;
  }

  //Delete an expense type
  deleteExpenseType(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.expenseType + ' Expense Type',
      message: 'Are you sure you want to remove this expense type?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteExpenseType(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The expense type has been deleted successfully');
            }
            this.getExpenseTypes();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  /*************** PAYROLL CREDIT TYPES RELATED ACTIONS ***************/

  //Get all payroll credit types
  getPayrollCredits() {
    this.hrService.getPayrollCredits().subscribe((res:any) => {
      this.payrollCreditList = res.data;
      this.payrollAccordionItems.find(x => {
        if(x.key == 'payrollCredits') x.list = this.payrollCreditList;
      })
    });
  }

  //Create a new payroll credit type
  createPayrollCredit() {
    this.dialog.open(PayrollCreditInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: this.hrSettingsForm.value.payrollCredit,
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getPayrollCredits();
      this.hrSettingsForm.controls['payrollCredit'].reset()
    });
  }

  //Edit a payroll credit type
  editPayrollCredit(details: any) {
    this.dialog.open(PayrollCreditInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.name,
        id: details._id,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPayrollCredits();
    });
  }

  //Delete a payroll credit type
  deletePayrollCredit(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.name,
      message: 'Are you sure you want to remove this payroll credit type?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deletePayrollCredit(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The payroll credit type has been deleted successfully');
            }
            this.getPayrollCredits();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  /*************** PAYROLL DEBIT TYPES RELATED ACTIONS ***************/

  //Get all payroll debit types
  getPayrollDebits() {
    this.hrService.getPayrollDebits().subscribe((res:any) => {
      this.payrollDebitList = res.data;
      this.payrollAccordionItems.find(x => {
        if(x.key == 'payrollDebits') x.list = this.payrollDebitList;
      })
    });
  }

  //Create a new payroll debit type
  createPayrollDebit() {
    this.dialog.open(PayrollDebitInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: this.hrSettingsForm.value.payrollDebit,
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getPayrollDebits();
      this.hrSettingsForm.controls['payrollDebit'].reset()
    });
  }

  //Edit a payroll debit type
  editPayrollDebit(details: any) {
    this.dialog.open(PayrollDebitInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.name,
        id: details._id,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPayrollDebits();
    });;
  }

  //Delete a payroll debit type
  deletePayrollDebit(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.name,
      message: 'Are you sure you want to remove this payroll debit type?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deletePayrollDebit(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('This payroll debit type has been deleted successfully');
            }
            this.getPayrollDebits();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }
}
