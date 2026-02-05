import { Component, OnInit } from '@angular/core';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { MatTableDataSource } from '@angular/material/table';
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ReimbursementTable } from 'src/app/shared/models/reimbursement-data';
import { FormFields } from '../../../../shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { ExpenseRequestReviewComponent } from '../../expense-management/expense-request-review/expense-request-review.component';

@Component({
  selector: 'app-self-service-reimbursement',
  templateUrl: './self-service-reimbursement.component.html',
  styleUrls: ['./self-service-reimbursement.component.scss']
})
export class SelfServiceReimbursementComponent implements OnInit {

  userDetails: any;
  userId: string;
  displayedColumns: any[];
  dataSource: MatTableDataSource<ReimbursementTable>;
  expenseRecords: any[] = [];
  minDate: Date = new Date();

  expenseRequestFields: FormFields[];
  expenseForm!: FormGroup

  expenseTypes: any[] = [];

  attachmentFile: File;
  attachmentName: string | SafeUrl = 'https://onburdstorageaccount.blob.core.windows.net/onburd/public/onburd_fe/assets/onburd-corporate/images/user_profile_icon.svg';


  //Leave Request Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "attachment",
      label: "Attachment",
      order: 1,
      columnWidth: "3.5%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "expenseTypeName",
      label: "Expense Type",
      order: 2,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "amount",
      label: "Amount",
      order: 3,
      columnWidth: "6%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "dateRequested",
      label: "Date Requested",
      order: 4,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "approver",
      label: "Approver",
      order: 5,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      order: 6,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    // {
    //   key: "dateRemitted",
    //   label: "Date Remitted",
    //   order: 7,
    //   columnWidth: "10%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    {
      key: "actions",
      label: "Actions",
      order: 10,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    }
  ]

  tableData: ReimbursementTable[] = [
    {
      id: 1,
      "Employee ID": "EMP-2021-MB45",
      "Expense Type": "Transport Fare",
      "First Name": "Mellie",
      "Last Name": "Gabbott",
      "Date Used": "Jan 10, 2023",
      "Amount": "£ 100",
      "Attachment": "transportReceipt.pdf",
      "Date Requested": "Jan 12, 2023",
      "Decision Date": "",
      "Date Remitted": "",
      "Approver": "Thomas Jefferson",
      "Status": "Pending"
    },
    {
      id: 2,
      "Employee ID": "EMP-2020-MB25",
      "Expense Type": "Conference Fees",
      "First Name": "Mellie",
      "Last Name": "Gabbott",
      "Date Used": "Feb 4, 2023",
      "Amount": "£ 700",
      "Attachment": "receipt.pdf",
      "Date Requested": "Feb 10, 2023",
      "Decision Date": "Mar 12, 2023",
      "Date Remitted": "Apr 10, 2023",
      "Approver": "Thomas Jefferson",
      "Status": "Completed"
    },
    {
      id: 3,
      "Employee ID": "EMP-2019-MB03",
      "Expense Type": "Goods Purchase",
      "First Name": "Mellie",
      "Last Name": "Gabbott",
      "Date Used": "Dec 2, 2023",
      "Amount": "£ 350",
      "Attachment": "invoice.pdf",
      "Date Requested": "Dec 2, 2023",
      "Decision Date": "Dec 12, 2023",
      "Date Remitted": "Dec 17, 2023",
      "Approver": "Rita Smak",
      "Status": "Completed"
    },
    {
      id: 4,
      "Employee ID": "EMP-2021-MB45",
      "Expense Type": "Transport",
      "First Name": "Mellie",
      "Last Name": "Gabbott",
      "Date Used": "Nov 10, 2022",
      "Amount": "£ 50",
      "Attachment": "print.pdf",
      "Date Requested": "Nov 10, 2022",
      "Decision Date": "Nov 12, 2022",
      "Date Remitted": "",
      "Approver": "Rita Smak",
      "Status": "Declined"
    },
  ]

  constructor(
    private hrService: HumanResourcesService,
    private notifyService: NotificationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) {
    this.getPageData(); 
  }

  ngOnInit(): void {
    this.userDetails = JSON.parse(sessionStorage.getItem("loggedInUser"))['data'];
    console.log(this.userDetails);
    this.userId = this.userDetails._id;

    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
  }

  //Converts amount to comma separated format
  convertAmount(amount: string) {
    return (Number(amount)).toLocaleString();
  }

  getPageData = async () => {
    this.expenseTypes = await this.hrService.getExpenseTypes().toPromise();
    this.expenseTypes = await this.expenseTypes['data'];

    this.expenseRecords = await this.hrService.getExpenseRequests().toPromise();
    this.dataSource = new MatTableDataSource(this.expenseRecords['data']);

    console.log(this.expenseRecords);

    // this.dataSource = new MatTableDataSource(this.leaveRecords['data']);

    this.expenseRequestFields = [
      {
        controlName: 'expenseType',
        controlType: 'select',
        controlLabel: 'Expense Type',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.expenseTypes, 'expenseType'),
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'expenseDate',
        controlType: 'date',
        controlLabel: 'Expense Date',
        controlWidth: '48%',
        initialValue: '',
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'currency',
        controlType: 'select',
        controlLabel: 'Currency',
        controlWidth: '26%',
        initialValue: '(₦)Naira',
        selectOptions: {
          '(₦)Naira': '(₦)Naira',
          '($)Dollar': '($)Dollar',
          '(£)Pounds': '(£)Pounds',
          '(€)Euro': '(€)Euro'
        },
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'amount',
        controlType: 'text',
        controlLabel: 'Amount',
        controlWidth: '20%',
        initialValue: null,
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'upload',
        controlType: 'file',
        controlLabel: 'Attachment',
        controlWidth: '48%',
        initialValue: null,
        validators: [Validators.required],
        order: 5
      },
      {
        controlName: 'description',
        controlType: 'text',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: null,
        validators: [Validators.required],
        order: 6
      }
    ]

    this.expenseRequestFields.sort((a,b) => (a.order - b.order));
    this.expenseForm = this.fb.group({})

    this.expenseRequestFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.expenseForm.addControl(field.controlName, formControl)
    })
  }

  //Converts an array to an Object of key value pairs
  arrayToObject(arrayVar, key:string) {
    console.log(arrayVar);
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    console.log(reqObj);
    return reqObj;
  }

  attachmentUpload(event) {
    this.attachmentFile = event.target.files[0];
    this.attachmentName = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(event.target.files[0])
    );
    console.log(this.attachmentFile.name);
    this.expenseForm.controls.upload.setValue(this.attachmentFile.name);
    // this.expenseForm.value.attachment = this.attachmentFile.name;
    // this.fileName = this.employeesFile.name;
  }

  createExpenseRequest() {
    console.log(this.attachmentFile);
    if(this.expenseForm.valid) {
      const formData = new FormData();

      formData.append('expenseTypeId', this.expenseForm.value.expenseType);
      formData.append('expenseDate', this.datePipe.transform(this.expenseForm.value.expenseDate, 'dd-MM-yyyy'));
      formData.append('amount', this.expenseForm.value.amount);
      formData.append('description', this.expenseForm.value.description);
      formData.append('attachment', this.attachmentFile);
      // let data = {
      //   expenseTypeId: this.expenseForm.value.expenseType,
      //   expenseDate: this.datePipe.transform(this.expenseForm.value.expenseDate, 'dd-MM-yyyy'),
      //   amount: this.expenseForm.value.amount,
      //   description: this.expenseForm.value.description,
      //   attachment: this.attachmentFile
      // }
      this.hrService.createExpenseRequest(formData).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('You expense request has been sent successfully');
            this.getPageData();
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }
  }

  //Edit an expense request
  editExpenseRequest(details: any) {
    this.dialog.open(ExpenseRequestReviewComponent, {
      width: '30%',
      height: 'auto',
      data: {
        id: details._id,
        isExisting: true,
        modalInfo: details,
        expenseTypes: this.expenseTypes, 
        forApproval: false
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  //Delete a leave request
  deleteExpenseRequest(info: any) {
    this.notifyService.confirmAction({
      title: 'Delete Expense Request',
      message: 'Are you sure you want to delete this expense request?',
      confirmText: 'Delete Request',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteExpenseRequest(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('This expense request has been deleted successfully');
            }
            this.getPageData();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  strToDate(dateVal: string, key:string) {
    if(key == 'dateRequested') {
      // const [day, month, year] = dateVal.split('/');
      let newFormat = new Date(dateVal);
      // console.log(newFormat.toDateString());
      return this.datePipe.transform(newFormat, 'd MMMM, y')
    }
    else {
      const [day, month, year] = dateVal.split('/');
      let newFormat = new Date(+year, +month - 1, +day);
      // console.log(newFormat.toDateString());
      return this.datePipe.transform(newFormat, 'd MMMM, y')
    }    
  }

}
