import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { FormFields } from 'src/app/shared/models/form-fields';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {

  courseId:string;
  courseInView:any;
  videoUrl:string;
  @ViewChild('videoPlayer') video: any;
  currentTime: number = 0;
  duration: number;
  videoProgress:number = 0;
  isFullScreen: boolean = false;
  videoPlaying:boolean = false;
  activeTab:string = 'about';
  assessmentDetails:any;
  hasPassed:boolean = false;

  loggedInUser: any;
  apiLoading:boolean = false;

  previewModalOpened:boolean = false;
  assessmentInView$ = new BehaviorSubject<any>(null);
  timeLimit$ = new BehaviorSubject<number>(null);

  constructor(
    private router: Router,
    private location: Location,
    private notifyService: NotificationService,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private hrService: HumanResourcesService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.courseId = this.activatedRoute.snapshot.params["id"];
    //console.log(this.courseId);
    this.loggedInUser = this.authService.loggedInUser.data;
    //console.log(this.loggedInUser)

    const courseInfo$ = this.hrService.getCourse(this.courseId).subscribe(res => {
      this.courseInView = res.data.course;
      if(!this.loggedInUser.isSuperAdmin) this.getCourseProgress();
      else this.videoUrl = this.courseInView.videoUrl
      
      this.assessmentDetails = res.data.quiz;
      this.assessmentInView$.next(this.assessmentDetails?.questions);
      this.hasPassed = this.assessmentDetails?.submissions.some(x => x.passed)
      //this.videoUrl = this.courseInView.videoUrl;
      console.log(this.assessmentDetails)
      //this.setVideoSourceToObjectUrl(this.courseInView.videoUrl)
      console.log(this.courseInView)
    })
  }

  ngAfterViewInit() {
    document.addEventListener('fullscreenchange', () => {
      this.isFullScreen = !!document.fullscreenElement; // Check if fullscreenElement is not null
    });

    this.video.nativeElement.onloadedmetadata = () => {
      this.duration = this.video.nativeElement.duration;
    };

    this.video.nativeElement.onplaying = (event) => {
      // console.log('Video is no longer paused.');
      this.videoPlaying = true;
    };
  }

  playVideo(event: any) {
    this.video.nativeElement.play();
  }

  pauseVideo(event: any) {
    this.video.nativeElement.pause();
    this.videoPlaying = false;
  }

  // videoClicked(event:any) {
  //   console.log(event)
  // }

  updateProgress(videoElement: HTMLVideoElement) {
    this.currentTime = videoElement.currentTime;
    this.videoProgress = Math.floor(this.currentTime*100/this.duration);
    if(this.video.nativeElement.paused) this.videoPlaying = false;
    // console.log(this.duration, this.currentTime)
  }

  goBack() {
    this.location.back();
  }

  //Retrieve the video (Careful of CORS)
  // setVideoSourceToObjectUrl = (url: string) =>
  //   fetch(url)
  //   .then(response => response.blob()) //Encode the response as a blob
  //   .then(blob => {
  //     // Create an object url from the blob;
  //     var blobUrl = URL.createObjectURL(blob);

  //     // Create a safe url and set it to the video source.
  //     this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
  //   }
  // );

  ngOnDestroy() {
    if(!this.loggedInUser.isSuperAdmin) this.saveCourseProgress();
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

  editCourse() {
    this.router.navigateByUrl(`app/human-resources/lms/courses/info/${this.courseId}`);
  }

  getCourseProgress() {
    this.hrService.getCourseProgress(this.courseId, this.loggedInUser._id).subscribe(res => {
      // console.log(res)
      this.videoProgress = res.data.progress
      this.duration = Number(res.data.duration);
      if(this.videoProgress == 0) this.videoUrl = this.courseInView.videoUrl
      else this.videoUrl = this.courseInView.videoUrl + `#t=${this.videoProgress*this.duration/100}`; 
    })
  }

  saveCourseProgress() {
    let payload = {
      progress: this.videoProgress,
      duration: this.duration
    }
    this.hrService.updateCourseProgress(payload, this.courseId, this.loggedInUser._id).subscribe({
      next: (res) => {
        if(res.success) {
          console.log('Progress saved', res)
        }
      },
      error: () => {}
    })
  }

  openAssessmentCheck() {
    if(this.hasPassed) this.activeTab = 'quiz'
    else {
      this.apiLoading = true;
      const assessmentDetails$ = this.hrService.getCourseAssessment(this.courseId).subscribe(res => {
        console.log(res.data)
        this.apiLoading = false;
        let stats = res.data[0];
        this.notifyService.confirmAction({
          title: 'Take Assessment',
          message: `<p>This test consists of ${stats.totalQuestions} questions for a duration of ${stats.timeLimit}mins with a pass score of ${stats.passingScore}%.</p> <br> <p>If you do not finish before the timer runs out, the system will automatically submit your assessment.</p> <br> <p>You can proceed if you are set to begin.</p>`,
          confirmText: 'Start Assessment',
          cancelText: 'Cancel',
        }).subscribe((confirmed) => {
          if(confirmed) {
            this.previewAssessment();
          }
        });
      })
    }    
  }

  closePreviewModal() {
    //this.assessmentInView$.next(null);
    this.previewModalOpened = false;
  }

  previewAssessment() {
    this.previewModalOpened = true;
    this.timeLimit$.next(this.assessmentDetails.timeLimit)
  }
}
