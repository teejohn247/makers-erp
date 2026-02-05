import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recruitment-screening',
  templateUrl: './recruitment-screening.component.html',
  styleUrls: ['./recruitment-screening.component.scss']
})
export class RecruitmentScreeningComponent implements OnInit {

  candidates: any[];
  selectedJob: string;

  jobApplications = [
    {
      id: 1,
      jobId: "MARK-2045",
      jobTitle: "Marketing Analyst",
      department: "Marketing",
      applicants: 45,
      shortlisted: 30,
      interviews: 10,
      selected: 2,
      jobType: "Full Time",
      openingDate: "Feb 11, 2023",
      closingDate: "Feb 27, 2023",
      hiringManager: "Simon Dowen",
      status: "Expired",
      clicked: true,
      candidates: [
        {
          id: 1,
          firstName: "Romina",
          lastName: "Valko",
          email: "rominavalko@yahoo.com",
          image: "staff2.jpg",
          overallStatus: "Awaiting Feedback",
          stages: [
            {
              name: "Interview",
              status: "completed"
            },
            {
              name: "Feedback",
              status: "awaiting"
            },
            {
              name: "Negotiation",
              status: "pending"
            },
            {
              name: "Decision",
              status: "pending"
            }
          ] 
        },
        {
          id: 2,
          firstName: "Stephen",
          lastName: "Murray",
          email: "stephenmurray@gmail.com",
          image: "staff3.jpg",
          overallStatus: "Negotiations",
          stages: [
            {
              name: "Interview",
              status: "completed"
            },
            {
              name: "Feedback",
              status: "completed"
            },
            {
              name: "Negotiation",
              status: "awaiting"
            },
            {
              name: "Decision",
              status: "pending"
            }
          ] 
        },
        {
          id: 3,
          firstName: "Jonathan",
          lastName: "Galant",
          email: "jonathangalant@gmail.com",
          image: "staff1.jpg",
          overallStatus: "Decision",
          stages: [
            {
              name: "Interview",
              status: "completed"
            },
            {
              name: "Feedback",
              status: "completed"
            },
            {
              name: "Negotiation",
              status: "completed"
            },
            {
              name: "Decision",
              status: "awaiting"
            }
          ] 
        },
        {
          id: 4,
          firstName: "Patricia",
          lastName: "Gomez",
          email: "patriciagomez@gmail.com",
          image: "profile-img.jpg",
          overallStatus: "Interview Scheduled",
          stages: [
            {
              name: "Interview",
              status: "awaiting"
            },
            {
              name: "Feedback",
              status: "pending"
            },
            {
              name: "Negotiation",
              status: "pending"
            },
            {
              name: "Decision",
              status: "pending"
            }
          ] 
        }
      ]
    },
    {
      id: 2,
      jobId: "TECH-3445",
      jobTitle: "Senior Analyst",
      department: "Technology",
      applicants: 89,
      shortlisted: 60,
      interviews: 32,
      selected: 5,
      jobType: "Contract",
      openingDate: "Mar 24, 2023",
      closingDate: "April 27, 2023",
      hiringManager: "Chris Joyles",
      status: "Active",
      clicked: false,
      candidates: [
        {
          id: 1,
          firstName: "Bragle",
          lastName: "Mulins",
          email: "braglemullins@yahoo.com",
          image: "profile-img.jpg",
          overallStatus: "Awaiting Feedback",
          stages: [
            {
              name: "Interview",
              status: "awaiting"
            },
            {
              name: "Feedback",
              status: "pending"
            },
            {
              name: "Negotiation",
              status: "pending"
            },
            {
              name: "Decision",
              status: "pending"
            }
          ] 
        },
        {
          id: 2,
          firstName: "Richard",
          lastName: "Fray",
          email: "frayrichard@gmail.com",
          image: "staff2.jpg",
          overallStatus: "Negotiations",
          stages: [
            {
              name: "Interview",
              status: "completed"
            },
            {
              name: "Feedback",
              status: "pending"
            },
            {
              name: "Negotiation",
              status: "pending"
            },
            {
              name: "Decision",
              status: "pending"
            }
          ] 
        },
        {
          id: 3,
          firstName: "Meghan",
          lastName: "Markle",
          email: "meghan@gmail.com",
          image: "staff3.jpg",
          overallStatus: "Rejected",
          stages: [
            {
              name: "Interview",
              status: "completed"
            },
            {
              name: "Feedback",
              status: "completed"
            },
            {
              name: "Negotiation",
              status: "completed"
            },
            {
              name: "Decision",
              status: "rejected"
            }
          ] 
        },
        {
          id: 4,
          firstName: "Peter",
          lastName: "Steelmane",
          email: "peter@gmail.com",
          image: "staff1.jpg",
          overallStatus: "Missed Interview",
          stages: [
            {
              name: "Interview",
              status: "missed"
            },
            {
              name: "Feedback",
              status: "pending"
            },
            {
              name: "Negotiation",
              status: "pending"
            },
            {
              name: "Decision",
              status: "pending"
            }
          ] 
        }
      ]
    },
    {
      id: 3,
      jobId: "HR-5645",
      jobTitle: "HR Consultant",
      department: "Human Resources",
      applicants: 23,
      shortlisted: 15,
      interviews: 7,
      selected: 1,
      jobType: "Full Time",
      openingDate: "July 11, 2023",
      closingDate: "July 15, 2023",
      hiringManager: "Simon Dowen",
      status: "Active",
      clicked: false
    },
    {
      id: 4,
      jobId: "ACC-3445",
      jobTitle: "Finance Officer",
      department: "Accounts",
      applicants: 45,
      shortlisted: 22,
      interviews: 10,
      selected: 1,
      jobType: "Part Time",
      openingDate: "Sep 12, 2023",
      closingDate: "Sep 14, 2023",
      hiringManager: "Simon Dowen",
      status: "Expired",
      clicked: false
    },
  ]

  constructor() { }

  ngOnInit(): void {
    this.candidates = this.jobApplications[0].candidates;
    this.selectedJob = this.jobApplications[0].jobTitle;
  }

  viewJobApplications(jobId) {
    this.jobApplications.map(item => {
      item.clicked = false;
    })
    this.jobApplications.find(item => {
      if(item.id == jobId) {
        item.clicked = true;
        this.selectedJob = item.jobTitle;
        this.candidates = item.candidates;
      }
    });
  }

}
