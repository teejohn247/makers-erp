import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { FormFields } from 'src/app/shared/models/form-fields';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { finalize, map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-assessment-page',
  templateUrl: './assessment-page.component.html',
  styleUrls: ['./assessment-page.component.scss']
})
export class AssessmentPageComponent implements OnInit {

  @Input() assessmentId:string = '';
  @Input() assessmentTitle = '';
  @Input() assessmentInfo$ = new BehaviorSubject<any>(null);
  @Input() assessmentDuration$ = new BehaviorSubject<number>(null);
  @Output() triggerModalClosure:EventEmitter<any> = new EventEmitter();
  timeLeft: { hours: number, minutes: number, seconds: number } | null = null;

  apiLoading:boolean = false;
  assessmentInfoForm!: FormGroup;
  assessmentInfoFields: FormFields[];
  courses:any[] = [];
  questionDetails:FormArray;
  questionInViewIndex:number;
  questionRatingOptions:any[] = [];
  showQuestionsPreview:boolean = true;
  loggedInUser: any;
  
  constructor(
    private sanitizer: DomSanitizer,
    private location: Location,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private authService: AuthenticationService,
    // @Inject(MAT_DIALOG_DATA) public dialogData: any,
    // public dialogRef: MatDialogRef<CustomerInfoComponent>,
    @Inject(HumanResourcesService) private hrService: HumanResourcesService,
    @Inject(NotificationService) private notifyService: NotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser.data;

    this.assessmentInfoForm = new FormGroup({
      questions: new FormArray([]),
    });

    this.questionDetails = this.assessmentInfoForm.get("questions") as FormArray;

    this.assessmentInfo$.subscribe(assessmentInView => {
      console.log('Questions', assessmentInView)
      if(assessmentInView != null) {
        // this.assessmentInfoForm.patchValue({
        //   questionTitle: assessmentInView.title,
        //   course: assessmentInView.course,
        //   duration: assessmentInView.duration,
        //   passScore: assessmentInView.passScore
        // });
        assessmentInView.forEach((item, index) => {
          this.addQuestion(item, index)
        })
        console.log(this.assessmentInfoForm.value)
      }
      else {
        //console.log('I am null')
        this.assessmentInfoForm.reset();
        this.assessmentInfoForm.controls['questions'].reset()
        //console.log(this.assessmentInfoForm.value);
      }
    });

    this.assessmentDuration$.subscribe(val => {
      this.startTimer(val)
    });
  }

  closeModal() {
    this.triggerModalClosure.emit('close');
  }

  // addQuestion(info?:any) {
  //   // console.log('I have info', info)
  //   const question = new FormGroup({
  //     questionTitle: new FormControl(info ? info.title : 'Question ' + Number(this.questionDetails.controls.length + 1), Validators.required),
  //     score: new FormControl(info ? info.score : 0),
  //     difficulty: new FormControl(info ? info.score : 0),
  //     explanation: new FormControl(info ? info.explanation : ''),
  //     options: new FormArray([]),
  //   });

  //   this.questionDetails.push(question);
  //   this.questionInViewIndex = this.questionDetails.length
  // }

  addQuestion(info?:any, questionIndex?:number) {
    const question = new FormGroup({
      questionId: new FormControl(info ? info?._id : ''),
      questionNo: new FormControl('Question ' + Number(this.questionDetails.controls.length + 1), Validators.required),
      questionTitle: new FormControl(info ? info.questionTitle ? info.questionTitle : info.text : ''),
      score: new FormControl(0),
      difficulty: new FormControl(0),
      explanation: new FormControl(info ? info.explanation : ''),
      options: new FormArray([]),
    });

    this.questionDetails.push(question);
    info.options.forEach((opt, index) => {
      this.addOption(questionIndex, opt, info.correctOption, index)
    })
    this.questionInViewIndex = info ? 1 : this.questionDetails.length
  }

  questionOptions(questionIndex:number) : FormArray {
    return this.questionDetails.at(questionIndex).get("options") as FormArray
  }
  // addOption(questionIndex:number, optionInfo?:any) {
  //   const option = new FormGroup({
  //     option: new FormControl(optionInfo ? optionInfo.option : '', Validators.required),
  //     selected: new FormControl(optionInfo ? optionInfo.isCorrect : false, Validators.required),
  //   });

  //   this.questionOptions(questionIndex).push(option);
  // }

  addOption(questionIndex:number, optionInfo?:any, correctOptions?:any[], optionIndex?:number) {
    const option = new FormGroup({
      option: new FormControl(optionInfo ? optionInfo.option ? optionInfo.option : optionInfo : '', Validators.required),
      isCorrect: new FormControl(false, Validators.required),
      selected: new FormControl(false, Validators.required),
    });

    this.questionOptions(questionIndex).push(option);
  }

  startCountdown(hours: number, minutes: number): Observable<{ hours: number, minutes: number, seconds: number }> {
    let totalSeconds = hours * 3600 + minutes * 60;
    return interval(1000).pipe(
      map((elapsed) => totalSeconds - elapsed - 1),
      takeWhile((remaining) => remaining >= 0),
      map((remaining) => ({
        hours: Math.floor(remaining / 3600),
        minutes: Math.floor((remaining % 3600) / 60),
        seconds: remaining % 60
      })),
      finalize(() => {
        this.onCountdownComplete();
      })
    );
  }

  onCountdownComplete() {
    this.closeModal();
  }

  startTimer(duration:number) {
    // const hours = Math.floor(duration / 60);
    const minutes = duration > 60 ? Math.floor(duration / 60) : duration;
    //console.log(minutes)
    this.startCountdown(0, minutes).subscribe({
      next: (time) => this.timeLeft = time,
      complete: () => {},
    });
  }

  confirmSubmission() {
    if(this.loggedInUser.isSuperAdmin) this.closeModal();
    else {
      this.notifyService.confirmAction({
        title: 'Submit Assessment',
        message: `<p>Are you sure you want to submit now?</p> <br> <p>If you click submit, the system will automatically submit your assessment.</p>`,
        confirmText: 'Yes, Submit',
        cancelText: 'No, Cancel',
      }).subscribe((confirmed) => {
        if(confirmed) {
          this.submitAssessment();
        }
      });
    }
  }

  submitAssessment() {
    console.log(this.assessmentInfoForm.value);
    let payload = {
      quizId: this.assessmentId,
      answers: this.assessmentInfoForm.value.questions.map(x => {
        return {
          questionId: x.questionId,
          selectedOption: x.options.map((y, index) => {
            if(y.selected) return index
          }).filter(item => item != undefined)
        }
      })
    }
    console.log(payload)
    this.hrService.submitAssessment(payload).subscribe({
      next: (res) => {
        if(res.success) {
          this.notifyService.confirmAction({
            title: '',
            message: res.data.passed ? `Congratulations, you have passed this assessment with a score of ${res.data.score}%` : `Unfortunately, you had a score of ${res.data.score}% and didn't reach the pass mark of ${res.data.passScore}%. Please try again later`,
            confirmText: 'Ok',
            cancelText: 'Ok',
            role: 'status',
            status: res.data.passed ? 'positive' : 'negative'
          }).subscribe((confirmed) => {
            this.closeModal();
          });
          
        }
      },
      error: () => {}
    })

  }

}
