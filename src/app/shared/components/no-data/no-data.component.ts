import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent implements OnInit {

  @Input() width:string = '100%';
  @Input() height:string = '100%';
  @Input() icon:string = 'folderOpen';
  @Input() iconSize:number = 80;
  @Input() message:string = 'No records exist';
  @Input() messageFontSize:string = '1rem';


  constructor() { }

  ngOnInit(): void {
  }

}
