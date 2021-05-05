import { Component, ViewChild, OnInit } from "@angular/core";
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi
} from "@fullcalendar/angular";
import { EventInput } from "@fullcalendar/angular";

import { MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Calendar } from "./calendar.model";
import { FormDialogComponent } from "./dialogs/form-dialog/form-dialog.component";
import { CalendarService } from "./calendar.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements OnInit {
  @ViewChild("calendar", { static: false })
  calendar: Calendar | null;
  public addCusForm: FormGroup;
  dialogTitle: string;
  filterOptions = "All";
  calendarData: any;
  filterItems: string[] = [
    "work",
    "personal",
    "important",
    "travel",
    "friends"
  ];

  calendarEvents: EventInput[];
  tempEvents: EventInput[];

  public filters = [
    { name: "work", value: "Work", checked: true },
    { name: "personal", value: "Personal", checked: true },
    { name: "important", value: "Important", checked: true },
    { name: "travel", value: "Travel", checked: true },
    { name: "friends", value: "Friends", checked: true }
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public calendarService: CalendarService,
    private snackBar: MatSnackBar,
    private service: CalendarService
  ) {
    this.dialogTitle = "Add New Event";
    this.calendar = new Calendar({});
    this.addCusForm = this.createCalendarForm(this.calendar);
  }

  public ngOnInit(): void {
    this.service.getAllCalendars().subscribe(response => {
      const reData = [];
      if (response && response.length > 0) {
        response.forEach(res => {
          res.forEach(data => {
            const interfacedData = {
              id: "event1",
              title: data.product_id,
              start: data.active_day + " " + data.start_date,
              end: data.active_day + " " + data.end_date,
              className: "fc-event-success",
              groupId: "work",
              details:
                data.userInfo.name +
                "Userid:" +
                data.user_id +
                " " +
                "productId:" +
                data.product_id
            };
            reData.push(interfacedData);
          });
        });
      }
      this.calendarOptions.events = reData;
      this.tempEvents = this.calendarEvents;
      this.calendarOptions.initialEvents = this.calendarEvents;
    });
  }

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
    },
    initialView: "dayGridMonth",
    weekends: true,
    editable: true,

    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      meridiem: false,
      hour12: false
    },
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };

  handleDateSelect(selectInfo: DateSelectArg) {
    this.addNewEvent();
  }

  addNewEvent() {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        calendar: this.calendar,
        action: "add"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "submit") {
        this.calendarData = this.calendarService.getDialogData();

        this.calendarEvents = this.calendarEvents.concat({
          // add new event data. must create new array
          id: this.calendarData.id,
          title: this.calendarData.title,
          start: this.calendarData.startDate,
          end: this.calendarData.endDate,
          className: this.getClassNameValue(this.calendarData.category),
          groupId: this.calendarData.category,
          details: this.calendarData.details
        });
        this.calendarOptions.events = this.calendarEvents;
        this.addCusForm.reset();
        this.showNotification(
          "snackbar-success",
          "Add Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }

  changeCategory(event: MatCheckboxChange, filter) {
    if (event.checked) {
      this.filterItems.push(filter.name);
    } else {
      this.filterItems.splice(this.filterItems.indexOf(filter.name), 1);
    }
    this.filterEvent(this.filterItems);
  }

  filterEvent(element) {
    const list = this.calendarEvents.filter(x =>
      element.map(y => y).includes(x.groupId)
    );

    this.calendarOptions.events = list;
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.eventClick(clickInfo);
  }

  eventClick(row) {
    const calendarData: any = {
      id: row.event.id,
      title: row.event.title,
      category: row.event.groupId,
      startDate: row.event.start,
      endDate: row.event.end,
      details: row.event.extendedProps.details
    };

    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        calendar: calendarData,
        action: "edit"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "submit") {
        this.calendarData = this.calendarService.getDialogData();
        this.calendarEvents.forEach(function(element, index) {
          if (this.calendarData.id === element.id) {
            this.editEvent(index, this.calendarData);
          }
        }, this);
        this.showNotification(
          "black",
          "Edit Record Successfully...!!!",
          "bottom",
          "center"
        );
        this.addCusForm.reset();
      } else if (result === "delete") {
        this.calendarData = this.calendarService.getDialogData();
        this.calendarEvents.forEach(function(element, index) {
          if (this.calendarData.id === element.id) {
            row.event.remove();
          }
        }, this);

        this.showNotification(
          "snackbar-danger",
          "Delete Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }

  editEvent(eventIndex, calendarData) {
    const calendarEvents = this.calendarEvents.slice();
    const singleEvent = Object.assign({}, calendarEvents[eventIndex]);
    singleEvent.id = calendarData.id;
    singleEvent.title = calendarData.title;
    singleEvent.start = calendarData.startDate;
    singleEvent.end = calendarData.endDate;
    singleEvent.className = this.getClassNameValue(calendarData.category);
    singleEvent.groupId = calendarData.category;
    singleEvent.details = calendarData.details;
    calendarEvents[eventIndex] = singleEvent;
    this.calendarEvents = calendarEvents; // reassign the array

    this.calendarOptions.events = calendarEvents;
  }

  handleEvents(events: EventApi[]) {
    // this.currentEvents = events;
  }

  createCalendarForm(calendar): FormGroup {
    return this.fb.group({
      id: [calendar.id],
      title: [
        calendar.title,
        [Validators.required, Validators.pattern("[a-zA-Z]+([a-zA-Z ]+)*")]
      ],
      category: [calendar.category],
      startDate: [calendar.startDate, [Validators.required]],
      endDate: [calendar.endDate, [Validators.required]],
      details: [
        calendar.details,
        [Validators.required, Validators.pattern("[a-zA-Z]+([a-zA-Z ]+)*")]
      ]
    });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  getClassNameValue(category) {
    let className: string;

    if (category === "work") className = "fc-event-success";
    else if (category === "personal") className = "fc-event-warning";
    else if (category === "important") className = "fc-event-primary";
    else if (category === "travel") className = "fc-event-danger";
    else if (category === "friends") className = "fc-event-info";

    return className;
  }
}
