import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { jsPDF } from 'jspdf';
import htmltocanvas from 'html2canvas';
import { Scale } from 'chart.js';

@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PayslipComponent implements OnInit {

  userDetails: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<PayslipComponent>,
    private datePipe: DatePipe,
    private authService: AuthenticationService, 
  ) { }

  ngOnInit(): void {
    this.userDetails = this.authService.loggedInUser.data;
    console.log(this.userDetails);
    console.log(this.dialogData);
  }

  //Convert string to camel case
  toCamelCase(str:string){
    return str.split(' ').map(function(word,index){
      // If it is the first word make sure to lowercase all the chars.
      if(index == 0){
        return word.toLowerCase();
      }
      // If it is not the first word only upper case the first char and lowercase the rest.
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
  }

  strToDate(dateVal: string) {
    let newFormat = new Date(dateVal);
    return this.datePipe.transform(newFormat, 'd MMMM, y')    
  }

  generatePdf() {
    const elementToPrint = document.getElementById('payslip');
    htmltocanvas(elementToPrint, {scale: 2}).then((canvas) => {
      const pdf = new jsPDF();
      // pdf.addImage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 250, 100);

      pdf.setProperties({
        title: this.dialogData.modalInfo[0].payrollPeriodName,
      })

      pdf.setFontSize(8);

      pdf.save('payslip.pdf');
    })
  }

}
