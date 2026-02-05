import { Component, OnInit } from '@angular/core';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { MatTableDataSource } from '@angular/material/table';
import { VisitorsTable } from 'src/app/shared/models/visitor-data';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { RegisterGuestComponent } from 'src/app/shared/components/register-guest/register-guest.component';

@Component({
  selector: 'app-visitors-log',
  templateUrl: './visitors-log.component.html',
  styleUrls: ['./visitors-log.component.scss']
})
export class VisitorsLogComponent implements OnInit {

  displayedColumns: any[];
  dataSource: MatTableDataSource<VisitorsTable>;
  selection = new SelectionModel<VisitorsTable>(true, []);

  visitorSummary = [
    {
      id: 1,
      visitorType: "Total Visitors",
      referenceDate: "Feb 11, 2023",
      visitorCount: 45,
      icon: "bi bi-people-fill",
      status: "total"
    },
    {
      id: 2,
      visitorType: "Active Visitors",
      referenceDate: "Feb 11, 2023",
      visitorCount: 15,
      icon: "bi bi-person-fill-check",
      status: "active"
    },
    {
      id: 3,
      visitorType: "Overstay Visitors",
      referenceDate: "Feb 11, 2023",
      visitorCount: 5,
      icon: "bi bi-person-fill-exclamation",
      status: "overstay"
    },
    {
      id: 4,
      visitorType: "Expected Visitors",
      referenceDate: "Feb 11, 2023",
      visitorCount: 20,
      icon: "bi bi-person-fill-slash",
      status: "expected"
    },
  ]

  //Visitor Log Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "select",
      label: "Select",
      order: 1,
      columnWidth: "2%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "image",
      label: "Image",
      order: 2,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "visitDate",
      label: "Visit Date",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "name",
      label: "Name",
      order: 3,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "host",
      label: "Host",
      order: 5,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "purpose",
      label: "Purpose",
      order: 6,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "checkin",
      label: "Check In",
      order: 7,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "checkout",
      label: "Check Out",
      order: 8,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "actions",
      label: "Actions",
      order: 9,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    }

  ]

  tableData: VisitorsTable[] = [
    {
      id: 1,
      "Name": "Diane Bell",
      "Image": "staff1.jpg",
      "Host": "Gregory Luke",
      "Purpose": "Interview",
      "Visit Date": "Feb 11, 2023",
      "Check In": "08:40 AM",
      "Check Out": "",
      "Status": "Active"
    },
    {
      id: 2,
      "Name": "Ricardo Miles",
      "Image": "staff3.jpg",
      "Host": "Michael Josh",
      "Purpose": "Courier",
      "Visit Date": "April 11, 2023",
      "Check In": "11:20 AM",
      "Check Out": "04:30 PM",
      "Status": "Inactive"
    },
    {
      id: 3,
      "Name": "Jamie Robertson",
      "Image": "staff2.jpg",
      "Host": "Ann Fisher",
      "Purpose": "Official",
      "Visit Date": "May 27, 2023",
      "Check In": "",
      "Check Out": "",
      "Status": "Expected"
    },
    {
      id: 4,
      "Name": "Lee Henry",
      "Image": "staff1.jpg",
      "Host": "Fisher Spikes",
      "Purpose": "Interview",
      "Visit Date": "May 11, 2023",
      "Check In": "08:40 AM",
      "Check Out": "",
      "Status": "Overstay"
    },
  ]

  constructor(public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.dataSource = new MatTableDataSource(this.tableData);
  }

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

  addNewVisitor() {
    const dialogRef = this.dialog.open(RegisterGuestComponent, {
      width: '30%',
      height: 'auto',
    });
  }

}
