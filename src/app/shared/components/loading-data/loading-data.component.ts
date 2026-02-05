import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-data',
  templateUrl: './loading-data.component.html',
  styleUrls: ['./loading-data.component.scss']
})
export class LoadingDataComponent implements OnInit {

  @Input() height:string = '20rem';
  constructor() { }

  ngOnInit(): void {
  }

}
