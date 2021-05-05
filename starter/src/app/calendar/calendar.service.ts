import { Injectable } from "@angular/core";
import {BehaviorSubject, of} from "rxjs";
import { Calendar } from "./calendar.model";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class CalendarService {
  private readonly API_URL = "http://127.0.0.1:8000/api/category/getAppointment";

  dataChange: BehaviorSubject<Calendar[]> = new BehaviorSubject<Calendar[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {}

  get data(): Calendar[] {
    this.getAllCalendars();
    console.log(this.dataChange.value);
    return this.dataChange.value;
    // this.getAllCalendars().subscribe(data => {
    //   return data;
    // });
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllCalendars(): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const data = { startDate: "2021-01-27", marketId: "12" };
    return this.httpClient
      .post(this.API_URL, data, { headers })
      .pipe(
        catchError(this.errorHandler)
      );
  }

  addUpdateCalendar(calendar: Calendar): void {
    this.dialogData = calendar;
  }
  deleteCalendar(calendar: Calendar): void {
    this.dialogData = calendar;
  }
  errorHandler(error) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
