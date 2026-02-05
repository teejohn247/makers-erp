import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';
import { EmployeeData, EmployeeTable } from 'src/app/shared/models/employee-data';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Icons } from '../../../../core/constants/icons';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { CreateSingleInfoComponent } from 'src/app/shared/components/create-single-info/create-single-info.component';
import { BulkUploadComponent } from '../bulk-upload/bulk-upload.component';
import { AssignManagerApproversComponent } from '../assign-manager-approvers/assign-manager-approvers.component';
import { DomSanitizer } from '@angular/platform-browser';
import { AssignSalaryScalesComponent } from '../assign-salary-scales/assign-salary-scales.component';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeesListComponent implements OnInit {

  icons = Icons;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort: MatSort;

  displayedColumns: any[];
  dataSource: MatTableDataSource<EmployeeData>;
  selection = new SelectionModel<EmployeeData>(true, []);

  employeeList: any[];
  departmentList: any[] = [];
  designationList: any[] = [];
  salaryScales: any[] = [];
  totalItems:number;
  pageSize:number;
  apiLoading:boolean = false;

  //Employee Table Column Names
  tableColumns: EmployeeTable[] = [
    {
      key: "select",
      label: "Select",
      order: 1,
      columnWidth: "3%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "image",
      label: "Image",
      order: 2,
      columnWidth: "4%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "name",
      label: "Name",
      order: 3,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "employmentType",
      label: "Job Type",
      order: 4,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "employmentStartDate",
      label: "Start Date",
      order: 5,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "department",
      label: "Department",
      order: 8,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "designationName",
      label: "Designation",
      order: 8,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "activeStatus",
      label: "Status",
      order: 10,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "actions",
      label: "Actions",
      order: 11,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      sortable: true
    }

  ]

  employeeData : any = [];

  public search$ = new BehaviorSubject<string>('');
  public page$ = new BehaviorSubject<number>(1);
  public size$ = new BehaviorSubject<number>(10);

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private sanitizer: DomSanitizer,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;

    this.size$.subscribe(val => this.pageSize = val)

    const employees$ = combineLatest([
      this.search$.pipe(debounceTime(300), distinctUntilChanged()),
      this.page$,
      this.size$
    ]).pipe(
      switchMap(([search, page, size]) => this.hrService.getEmployees(page, size, search))
    );

    employees$.pipe(
      tap(() => this.apiLoading = true),
      tap(res => {
        this.totalItems = res.totalRecords;
        this.employeeList = res.data;
        //console.log(res);
        this.dataSource = new MatTableDataSource(this.employeeList);
        this.paginator._intl.getRangeLabel = this.getRangeDisplayText;
      }),
      finalize(() => this.apiLoading = false)
    ).subscribe()

    this.getPageData();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      console.log(this.paginator)
      this.updatePage(this.paginator.pageIndex + 1);
      this.updateSize(this.paginator.pageSize);
      this.paginator._intl.getRangeLabel = this.getRangeDisplayText;
    });
  }

  // Change label display text
  getRangeDisplayText = (page: number, pageSize: number, length: number) => {
    const initialText = `Page`;  // customize this line
    if (length == 0 || pageSize == 0) {
      return `${initialText} 0 of ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length 
      ? Math.min(startIndex + pageSize, length) 
      : startIndex + pageSize;
    return `${initialText} ${startIndex + 1} to ${endIndex} of ${length}`; // customize this line
  };


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  addNewEmployee() {
    let dialogRef = this.dialog.open(CreateSingleInfoComponent, {
      width: '40%',
      height: 'auto',
      data: {
        departmentList: this.departmentList['data'],
        designationList: this.designationList['data'],
        isExisting: false
      },
    });
    // dialogRef.afterClosed().subscribe(() => {
    //   this.getEmployees();
    // }); 
  }

  addBulkEmployees() {
    let dialogRef = this.dialog.open(BulkUploadComponent, {
      width: '35%',
      height: 'auto',
      data: {
        departmentList: this.departmentList['data'],
        designationList: this.designationList['data'],
        isExisting: false
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPageData();
    }); 
  }

  //Delete an employee
  deleteEmployee(info: any) {
    console.log(info);
    this.notifyService.confirmAction({
      title: 'Remove Employee',
      message: `Are you sure you want to remove ${info.firstName + ' ' + info.lastName} as an employee?`,
      confirmText: 'Remove Employee',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteEmployee(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The employee has been deleted successfully');
            }
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  viewEmployee(info: any) {
    this.router.navigateByUrl(`app/human-resources/employees/${info._id}`);
  }

  getPageData = async () => {
    this.departmentList = await this.hrService.getDepartments().toPromise();
    this.designationList = await this.hrService.getDesignations().toPromise();
    const salaryScales$ = this.hrService.getSalaryScales().subscribe(res => this.salaryScales = res.data);    
  }

  updateSearch(term: string) {
    this.search$.next(term);
  }

  updatePage(page: number) {
    this.apiLoading = true
    this.page$.next(page);
  }

  updateSize(size: number) {
    this.apiLoading = true
    this.size$.next(size);
  }

  assignManager(assignType: string, count: string, row?: any) {
    if(row) this.selection.select(row);
    console.log(this.selection.selected);
    let dialogRef = this.dialog.open(AssignManagerApproversComponent, {
      width: '35%',
      height: 'auto',
      data: {
        assignmentType: assignType,
        employeeList: this.employeeList,
        selections: this.selection['selected'],
        isExisting: false
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.selection.clear()
      this.getPageData();
    }); 
  }

  assignSalaryScale(row?:any) {
    if(row) this.selection.select(row);
    let dialogRef = this.dialog.open(AssignSalaryScalesComponent, {
      width: '35%',
      height: 'auto',
      data: {
        salaryScales: this.salaryScales,
        selections: this.selection['selected'],
        isExisting: false
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.selection.clear()
      //this.getPageData();
    }); 
  }

  strToDate(dateVal: string) {
    let reqDate:any = new Date(dateVal)
    if(reqDate == 'Invalid Date') {
      const [day, month, year] = dateVal.split('-');
      let newFormat = new Date(+year, +month - 1, +day);
      reqDate = newFormat;
    }
    return reqDate;
  }

}
