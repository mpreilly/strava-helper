import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { FullActivity } from './full-activity';
import { token } from './auth-token';
import { R2WActivity } from './r2w-activity';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private http: HttpClient) { }

  // TODO: use environment variable for auth! (until actual auth flow at least)
  getActivities(): Observable<FullActivity[]> {
    const activitiesUrl = 'https://www.strava.com/api/v3/athlete/activities';
    const options = {
      headers: {
        Authorization: token,
      },
      params: new HttpParams().set('per_page', '60')
    };

    return this.http.get<FullActivity[]>(activitiesUrl, options);
  }

  // uploadActivities(activities: R2WActivity[]): void {

  // }
}
