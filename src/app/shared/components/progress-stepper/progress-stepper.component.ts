import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-progress-stepper',
  templateUrl: './progress-stepper.component.html',
  styleUrls: ['./progress-stepper.component.scss']
})
export class ProgressStepperComponent implements OnInit {

  @Input() stepperItems:any[] = [];
  @Input() currentStep:number;
  @Input() stepCount:number;
  @Output() triggerStepChange:EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  goToStep(evt) {
    this.triggerStepChange.emit(evt)
  }

}
