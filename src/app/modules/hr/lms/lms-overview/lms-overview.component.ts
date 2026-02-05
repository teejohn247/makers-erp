import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-lms-overview',
  templateUrl: './lms-overview.component.html',
  styleUrls: ['./lms-overview.component.scss']
})
export class LmsOverviewComponent implements OnInit {

  courseCategories:any[] = [];
  courses:any[] = [];
  loggedInUser: any;
  currentGraphIndex:number = 0;

  // slideConfig = {
  //   slidesToShow: 4, 
  //   slidesToScroll: 1
  // };

  constructor(
    private route: Router,
    private authService: AuthenticationService,
    @Inject(HumanResourcesService) private hrService: HumanResourcesService,
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser.data;

    const courseCategories$ = this.hrService.getCourseCategories().subscribe(res => {
      this.courseCategories = res.data;
      console.log(this.courseCategories);
    })

    const course$ = this.hrService.getCourses().subscribe(res => {
      this.courses = res.data.courses;
      console.log(this.courses)
    })

    this.courseCategories = [
      {
        name: 'Compliance',
        noOfCourses: 7,
        totalTime: '2hrs 30mins'
      },
      {
        name: 'Leadership',
        noOfCourses: 2,
        totalTime: '1hr 20mins'
      },
      {
        name: 'Management',
        noOfCourses: 5,
        totalTime: '3hrs'
      },
      {
        name: 'Health & Safety',
        noOfCourses: 10,
        totalTime: '7hrs'
      }
    ]

    this.courses = [
      {
        name: 'Project Management PIMP & ACAP',
        category: 'Management',
        thumbnail: 'https://greenpeg.com/wp-content/uploads/2023/03/workers.jpeg',
        noOfParticipants: 10,
        duration: '2hr 10mins',
        rating: 4.5
      },
      {
        name: 'HSE Compliance',
        category: 'Compliance',
        thumbnail: 'https://bgsnigerialimited.com/wp-content/uploads/2024/03/equipment-Lease.jpg',
        noOfParticipants: 20,
        duration: '1hr 15mins',
        rating: 3.5
      },
      {
        name: 'Sexual harrasment in the workplace',
        category: 'Compliance',
        thumbnail: 'assets/images/illustrations/sexual-harrasment.jpg',
        noOfParticipants: 6,
        duration: '1hr',
        rating: 4.8
      },
      {
        name: 'Managing surbodinates effectively',
        category: 'Leadership',
        thumbnail: 'assets/images/illustrations/leadership.png',
        noOfParticipants: 6,
        duration: '4hr',
        rating: 4
      }
    ]
  }

  addNewCourse() {
    this.route.navigate(['app/human-resources/lms/courses/info']);
  }

  viewDetails(info:any) {
    console.log(info)
    this.route.navigateByUrl(`app/human-resources/lms/courses/${info._id}`);
  }

  convertHrsMins(totalMinutes) {
    // console.log(totalMinutes)
    const hours = Math.floor(totalMinutes / 60);
    // const hours = totalMinutes >= 60 ? Math.floor(totalMinutes / 60) : 0;
    const hrsText = hours == 0 ? '' : hours > 1 ? `${hours}h` : `${hours}h`;
    const minutes = totalMinutes > 60 ? totalMinutes % 60 : totalMinutes;
    const minsText = minutes > 0 ? minutes > 1 ?  `${minutes}m` : `${minutes}m` : ''
    return `${hrsText} ${minsText}`;
  }

}
