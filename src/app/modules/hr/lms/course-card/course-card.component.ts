import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {

  @Input() courseInfo:any;
  @Input() cardWidth:string;
  @Input() isSuperAdmin:boolean;
  @Output() triggerDelete:EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  convertHrsMins(totalMinutes) {
    // console.log(totalMinutes)
    const hours = Math.floor(totalMinutes / 60);
    // const hours = totalMinutes >= 60 ? Math.floor(totalMinutes / 60) : 0;
    const hrsText = hours == 0 ? '' : hours > 1 ? `${hours}hrs` : `${hours}hr`;
    const minutes = totalMinutes > 60 ? totalMinutes % 60 : totalMinutes;
    const minsText = minutes > 0 ? minutes > 1 ?  `${minutes}mins` : `${minutes}min` : ''
    return `${hrsText} ${minsText}`;
  }

  deleteItem() {
    this.triggerDelete.emit(this.courseInfo);
  }

}
