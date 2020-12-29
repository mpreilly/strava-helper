import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { FullActivity } from './full-activity';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  // TODO: use environment variable for auth! (until actual auth flow at least)
  getActivities(): Observable<FullActivity[]> {
    const activitiesUrl = 'https://www.strava.com/api/v3/athlete/activities';
    const options = {
      headers: {
        Authorization: "Bearer 63d256c68c5c5f6fe3bce7498e88115443d53658",
      },
      params: new HttpParams().set('per_page', '60')
    };

    return this.http.get<FullActivity[]>(activitiesUrl, options);
  }

  constructor(private http: HttpClient) { }
}
