import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, FormArray } from '@angular/forms';
import { FormFields } from 'src/app/shared/models/form-fields';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-assessment-info',
  templateUrl: './assessment-info.component.html',
  styleUrls: ['./assessment-info.component.scss']
})
export class AssessmentInfoComponent implements OnInit {

  apiLoading:boolean = false;
  assessmentInfoForm!: FormGroup;
  assessmentInfoFields: FormFields[];
  courses:any[] = [];
  questionDetails:FormArray;
  questionInViewIndex:number;
  questionRatingOptions:any[] = [];
  viewingQuestions:boolean = true;

  assessmentGrades:any;
  displayedColumns: any[];
  dataSource: MatTableDataSource<any>;

  previewModalOpened:boolean = false;
  assessmentId:string;
  assessmentInView:any;
  assessmentInView$ = new BehaviorSubject<any>(null);
  timeLimit$ = new BehaviorSubject<number>(null);

  //Course Grades Table Column Names
  tableColumns: TableColumn[] = [
    // {
    //   key: "select",
    //   label: "Select",
    //   order: 1,
    //   columnWidth: "2%",
    //   cellStyle: "width: 100%",
    //   sortable: false
    // },
    {
      key: "image",
      label: "Image",
      order: 2,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "userName",
      label: "Name",
      order: 2,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "submittedAt",
      label: "Date",
      order: 8,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "score",
      label: "Score (%)",
      order: 4,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      order: 9,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    // {
    //   key: "actions",
    //   label: "Actions",
    //   order: 10,
    //   columnWidth: "8%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // }

  ]

  tableData: any[] = []

  constructor(
    private sanitizer: DomSanitizer,
    private location: Location,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    // @Inject(MAT_DIALOG_DATA) public dialogData: any,
    // public dialogRef: MatDialogRef<CustomerInfoComponent>,
    @Inject(HumanResourcesService) private hrService: HumanResourcesService,
    @Inject(OrdersService) private ordersService: OrdersService,
    @Inject(NotificationService) private notifyService: NotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.assessmentId = this.activatedRoute.snapshot.params["id"];
    console.log(this.assessmentId);


    this.assessmentInfoForm = new FormGroup({
      questions: new FormArray([]),
    })

    this.questionRatingOptions = [
      {
        key: 1,
        value: '1'
      },
      {
        key: 2,
        value: '2'
      },
      {
        key: 3,
        value: '3'
      },
      {
        key: 4,
        value: '4'
      },
      {
        key: 5,
        value: '5'
      }
    ]

    this.setUpForm();
    if(!this.assessmentId) this.addQuestion();

    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.getAssessmentGrades()
  }

  goBack() {
    this.location.back();
  }

  setUpForm() {
      
    this.assessmentInfoFields = [
      {
        controlName: 'title',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '30%',
        initialValue: null,
        selectOptions: {},
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'course',
        controlType: 'select',
        controlLabel: 'Course',
        controlWidth: '30%',
        initialValue: null,
        selectOptions: {},
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'duration',
        controlType: 'number',
        controlLabel: 'Duration (mins)',
        controlWidth: '16%',
        initialValue: null,
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'passScore',
        controlType: 'number',
        controlLabel: 'Pass Score (%)',
        controlWidth: '16%',
        initialValue: '',
        validators: [Validators.required],
        order: 4
      }
    ];

    this.assessmentInfoFields.sort((a,b) => (a.order - b.order));

    this.assessmentInfoFields.forEach(field => {
      const formControl = new FormControl(field.initialValue, field.validators)
      this.assessmentInfoForm.addControl(field.controlName, formControl)
    });

    const course$ = this.hrService.getCourses().subscribe(res => {
      this.courses = res.data.courses;
      this.assessmentInfoFields.find(item => {
        if(item.controlName == 'course') item.selectOptions = this.arrayToObject(this.courses, 'title');
      });
      // console.log(this.courses)
    })
    this.questionDetails = this.assessmentInfoForm.get("questions") as FormArray;

    if(this.assessmentId) this.getAssessmentDetails();
  }

  arrayToObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    //console.log(reqObj)
    return reqObj;
  }

  getAssessmentDetails() {
    this.hrService.getAssessment(this.assessmentId).subscribe(res => {
      this.assessmentInView = res.data;
      console.log(this.assessmentInView)
      this.assessmentInfoForm.patchValue({
        title: this.assessmentInView.title,
        course: this.assessmentInView.courseId,
        duration: this.assessmentInView.timeLimit,
        passScore: this.assessmentInView.passScore
      });
      this.assessmentInView.questions.forEach((item, index) => {
        this.addQuestion(item, index)
      })
    })
  }

  getAssessmentGrades() {
    this.hrService.getAssessmentGrades(this.assessmentId).subscribe(res => {
      this.assessmentGrades = res.data;
      console.log('Grades', this.assessmentGrades);
      this.dataSource = new MatTableDataSource(this.assessmentGrades.submissions);
    })
  }

  addQuestion(info?:any, questionIndex?:number) {
    //console.log('I have info', info)
    const question = new FormGroup({
      questionNo: new FormControl('Question ' + Number(this.questionDetails.controls.length + 1), Validators.required),
      questionTitle: new FormControl(info ? info.text : ''),
      score: new FormControl(0),
      difficulty: new FormControl(0),
      explanation: new FormControl(info ? info.explanation : ''),
      options: new FormArray([]),
    });

    this.questionDetails.push(question);
    info && info.options.forEach((opt, index) => {
      this.addOption(questionIndex, opt, info.correctOption, index)
    })
    this.questionInViewIndex = info ? 1 : this.questionDetails.length;
  }
  removeQuestion(index: number) {
    this.questionDetails.removeAt(index);
    this.questionInViewIndex = this.questionDetails.length
  }

  questionOptions(questionIndex:number) : FormArray {
    return this.questionDetails.at(questionIndex).get("options") as FormArray
  }
  addOption(questionIndex:number, optionInfo?:any, correctOptions?:any[], optionIndex?:number) {
    const option = new FormGroup({
      option: new FormControl(optionInfo ? optionInfo : '', Validators.required),
      isCorrect: new FormControl(optionInfo ? correctOptions.includes(optionIndex) : false, Validators.required),
      editMode: new FormControl(optionInfo ? false : true),
    });

    this.questionOptions(questionIndex).push(option);
    // this.assessmentInView$.next(this.assessmentInfoForm.value);
  }
  removeOption(questionIndex:number, optionIndex:number) {
    this.questionOptions(questionIndex).removeAt(optionIndex);
  }

  changeEditMode(questionIndex:number, optionIndex:number, editMode:boolean) {
    this.questionOptions(questionIndex).controls[optionIndex].get('editMode').setValue(editMode)
    // if(editMode || (!editMode && this.questionOptions(questionIndex).controls[optionIndex].get('option').valid)) {
      
    // }
    
  }

  closePreviewModal() {
    //this.assessmentInView$.next(null);
    this.previewModalOpened = false;
  }

  previewAssessment() {
    this.previewModalOpened = true;
    console.log(this.assessmentInView);
    this.assessmentInView$.next(this.assessmentInfoForm.value.questions);
    this.timeLimit$.next(this.assessmentInView.timeLimit)
  }

  onSubmit() {
    console.log(this.assessmentInfoForm.value)
    if(this.assessmentInfoForm.valid) {
      this.apiLoading = true;
      let payload = {
        title: this.assessmentInfoForm.value.title,
        courseId: this.assessmentInfoForm.value.course,
        description: this.assessmentInfoForm.value.title,
        timeLimit: this.assessmentInfoForm.value.duration,
        passScore: this.assessmentInfoForm.value.passScore,
        questions: this.generateQuestionPayload(this.assessmentInfoForm.value.questions)
      }
      console.log(payload);
      if(this.assessmentId) {
        this.hrService.updateAssessment(payload, this.assessmentId).subscribe({
          next: res => {
            console.log(res);
            if(res.success) {
              this.notifyService.showSuccess('This assessment has been updated successfully');
              this.apiLoading = false;
              //this.getAssessmentDetails();
            }
          },
          error: err => {
            console.log(err);
            this.apiLoading = false;
            this.notifyService.showError(err.error.error);
          } 
        })
      }
      else {
        this.hrService.createAssessment(payload).subscribe({
          next: res => {
            console.log(res);
            if(res.success) {
              this.notifyService.showSuccess('This assessment has been created successfully');
              this.apiLoading = false;
              this.router.navigateByUrl(`app/human-resources/lms/assessments`);
            }
            //this.getPageData();
          },
          error: err => {
            console.log(err);
            this.apiLoading = false;
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    }
  }

  generateQuestionPayload(questions:any[]) {
    return questions.map(item => {
      let reqObj = {
        text: item.questionTitle,
        options: item.options.map(opt => {return opt.option}),
        correctOption: item.options.map((opt, index) => { if(opt.isCorrect) return index}).filter(item => item != undefined),
        explanation: item.explanation
      }
      return reqObj
    })
  }

}
