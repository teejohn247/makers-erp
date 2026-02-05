import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-assessment-card',
  templateUrl: './assessment-card.component.html',
  styleUrls: ['./assessment-card.component.scss']
})
export class AssessmentCardComponent implements OnInit {

  @Input() cardInfo:any;
  @Input() cardWidth:string;
  @Input() isSuperAdmin:boolean;
  @Output() triggerDelete:EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  convertHrsMins(totalMinutes) {
    // console.log(totalMinutes)
    const hours = Math.floor(totalMinutes / 60);
    const hrsText = hours == 0 ? '' : hours > 1 ? `${hours}hrs` : `${hours}hr`;
    const minutes = totalMinutes % 60;
    const minsText = minutes > 0 ? minutes > 1 ?  `${minutes}mins` : `${minutes}min` : ''
    return `${hrsText} ${minsText}`;
  }

  deleteItem() {
    this.triggerDelete.emit(this.cardInfo);
  }

}
