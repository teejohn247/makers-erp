import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { DatePipe } from '@angular/common';
import { MeetingInfoComponent } from '../meeting-info/meeting-info.component';
import { PublicHolidayInfoComponent } from 'src/app/modules/settings/human-resources/absence/public-holiday-info/public-holiday-info.component';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  userDetails: any;
  employeeList: any[] = [];
  calendarDetails: any;
  sortedEvents: any[] = [];
  upcomingEvents: any[] = [];
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  holidayActions: CalendarEventAction[] = [
    {
      label: '<i class="bi bi-pen-fill ms-2"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        console.log(event);
        if(this.userDetails.isSuperAdmin) this.viewHolidayInfo(event);
      },
    }
  ]

  actions: CalendarEventAction[] = [
    {
      label: '<i class="bi bi-pen-fill ms-2"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.viewMeetingInfo(event);
      },
    },
    {
      label: '<i class="bi bi-trash3-fill ms-2 text-danger"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.deleteMeeting(event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modal: NgbModal,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private authService: AuthenticationService,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) {
    const formControls = this.eventFilters.map(control => new FormControl(false));
    const selectAllControl = new FormControl(false);
    this.filterForm = this.fb.group({
      eventFilters: new FormArray(formControls),
      selectAll: selectAllControl
    });
  }

  ngOnInit(): void {
    this.userDetails = this.authService.loggedInUser.data;
    const formControls = this.eventFilters.map(control => new FormControl(false));
    const selectAllControl = new FormControl(false);
    this.filterForm = this.fb.group({
      eventFilters: new FormArray(formControls),
      selectAll: selectAllControl
    });
    this.getPageData();

    this.filterChange();
  }

  getPageData = async () => {
    this.employeeList = await this.hrService.getEmployees().toPromise();
    this.calendarDetails = await this.hrService.getCalendar().toPromise(); 
    this.calendarDetails = this.calendarDetails['data'];   
    console.log(this.calendarDetails);
    if(this.calendarDetails) {
      this.sortCalendarEvents();
      this.generateEvents();
    }
  }

  // Event Filter Functions
  filterForm: FormGroup;
  eventFilters = [
    { id: 1, name: 'Meetings', icon:'alarm', class: 'meetings' },
    { id: 2, name: 'Holidays', icon:'building', class: 'holidays' },
    { id: 3, name: 'Leave Days', icon:'userMinus', class: 'leave' },
    // { id: 4, genre: 'Hiphop' }
  ];

  filterChange(): void {
    // Subscribe to changes on the selectAll checkbox
    this.filterForm.get('selectAll').valueChanges.subscribe(bool => {
      this.filterForm.get('eventFilters').patchValue(Array(this.eventFilters.length).fill(bool), { emitEvent: false });
    });

    // Subscribe to changes on the filter preference checkboxes
    this.filterForm.get('eventFilters').valueChanges.subscribe(val => {
      const allSelected = val.every(bool => bool);
      if (this.filterForm.get('selectAll').value !== allSelected) {
        this.filterForm.get('selectAll').patchValue(allSelected, { emitEvent: false });
      }
    });

    console.log(this.filterForm.value);
  }

  filterEvents() {
    // Filter out the unselected ids
    const selectedPreferences = this.filterForm.value.eventFilters.map((checked, index) => checked ? this.eventFilters[index].id : null).filter(value => value !== null);
    //console.log(selectedPreferences);
    // Do something with the result
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    if(event.allDay) this.viewHolidayInfo(event);
    else this.viewMeetingInfo(event);
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  createNewMeeting() {
    if(this.employeeList) {
      const dialogRef = this.dialog.open(MeetingInfoComponent, {
        width: '40%',
        height: 'auto',
        data: {
          isExisting: false,
          employeeList: this.employeeList['data']
        },
      });
      dialogRef.afterClosed().subscribe(() => {
        this.hrService.getCalendar().subscribe(res => {
          this.calendarDetails = res.data;
          this.generateEvents();
          // console.log(this.calendarDetails);
        });
      });
    }
    else {
      this.notifyService.showError('All data needed to create a meeting is not available yet. please try again');
    }
    
  }

  generateEvents() {
    this.generateHolidayEvents();
    this.generateMeetingEvents();
    console.log(this.events);
  }

  sortCalendarEvents() {
    this.calendarDetails['holidays'].map(event => {
      event['dateRef'] = event.date;
      event['type'] = 'holiday';
      this.sortedEvents.push(event);
    })

    this.calendarDetails['meetings'].map(event => {
      event['dateRef'] = event.meetingStartTime;
      event['type'] = 'meeting';
      this.sortedEvents.push(event);
    })

    this.sortedEvents.sort((a, b): any => {
      //console.log(a.dateRef, b.dateRef)
      if(a.dateRef && b.dateRef) {
        return a.dateRef.localeCompare(b.dateRef);
      } 
      return false
    });

    console.log('Sorted Events', this.sortedEvents)
    
    const today = new Date().getTime();
    this.upcomingEvents = this.sortedEvents.filter((items)  => {
      return new Date(items.dateRef).getTime() > today;
    })
    console.log(this.upcomingEvents);
  }

  generateHolidayEvents() {
    this.calendarDetails['holidays'].map((event: any) => {
      let eventData = {
        title: event.holidayName,
        start: startOfDay(this.strToDate(event.date)),
        end: endOfDay(this.strToDate(event.date)),
        color: colors.red,
        actions: this.userDetails.isSuperAdmin ? this.holidayActions : null,
        allDay: true,
        draggable: false,
        resizable: {
          beforeStart: false,
          afterEnd: false,
        },
      }
      this.events.push(eventData);
    })
  }

  generateMeetingEvents() {
    this.calendarDetails['meetings'].map((event: any) => {
      let eventData = {
        title: event.meetingTitle,
        start: this.strToDate(event.meetingStartTime),
        end: this.strToDate(event.meetingEndTime),
        color: colors.blue,
        actions: this.actions,
        allDay: false,
        draggable: false,
        resizable: {
          beforeStart: false,
          afterEnd: false,
        },
      }
      this.events.push(eventData);
    })
  }

  strToDate(dateString) {
    const dateObject = new Date(Date.parse(dateString));
    return dateObject
  }

  viewHolidayInfo(details: any) {
    // console.log(details)
    let modalInfo: any;
    this.calendarDetails['holidays'].find((x: any) => {
      if(x.holidayName == details.title) modalInfo = x;
    })
    this.dialog.open(PublicHolidayInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: modalInfo.holidayName,
        id: modalInfo._id,
        isExisting: true,
        modalInfo: modalInfo
      },
    })
  }

  viewMeetingInfo(details: any) {
    // console.log(details)
    let modalInfo: any = {};
    this.calendarDetails['meetings'].find((x: any) => {
      if(x.meetingTitle == details.title) modalInfo = x;
    })
    this.dialog.open(MeetingInfoComponent, {
      width: '35%',
      height: 'auto',
      data: {
        name: modalInfo.meetingTitle,
        id: modalInfo._id,
        isExisting: true,
        employeeList: this.employeeList['data'],
        modalInfo: modalInfo
      },
    })
  }

  //Delete a Meeting
  deleteMeeting(info: any) {
    this.notifyService.confirmAction({
      title: 'Delete ' + info.title,
      message: 'Are you sure you want to delete this meeting?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        // this.hrService.deletePayrollPeriod(info._id).subscribe({
        //   next: res => {
        //     // console.log(res);
        //     if(res.status == 200) {
        //       this.notifyService.showInfo('The period has been deleted successfully');
        //     }
        //     this.getPageData();
        //   },
        //   error: err => {
        //     console.log(err)
        //     this.notifyService.showError(err.error.error);
        //   } 
        // })
      }
    });
  }
}
