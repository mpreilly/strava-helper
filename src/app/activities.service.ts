import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { FullActivity } from './full-activity';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  getActivities(): Observable<FullActivity[]> {
    const activitiesUrl = 'https://www.strava.com/api/v3/athlete/activities';
    const options = {
      headers: {
        Authorization: "Bearer 202eddf478cf9053c76f3525735eb25dc8669dec",
      },
      params: new HttpParams().set('per_page', '60')
    };

    return this.http.get<FullActivity[]>(activitiesUrl, options);
  }

  constructor(private http: HttpClient) { }
}
