import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, first, retry } from 'rxjs/operators';

import { FullActivity } from './full-activity';
import { token } from './auth-token';
import { R2WActivity } from './r2w-activity';
import { makeRaceInfoString, makeWorkoutString } from './read-activity-objects';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private http: HttpClient) { }

  getActivities(): Observable<FullActivity[]> {
    const activitiesUrl = 'https://www.strava.com/api/v3/athlete/activities';
    const options = {
      headers: new HttpHeaders().set('Authorization', token),
      params: new HttpParams().set('per_page', '60')
    };

    return this.http.get<FullActivity[]>(activitiesUrl, options);
  }

  uploadActivities(activities: R2WActivity[]): void {
    const activityPostUrl = 'https://www.strava.com/api/v3/activities';
    
    // let i = 0;
    // let currentActivity = activities[i];

    activities.forEach(currentActivity => {
      let stravaTitle = currentActivity.r2wDate.split(",")[0] + " " + currentActivity.activityType + " [r2w upload]"
      let stravaDescription = currentActivity.description
      if (currentActivity.raceInfo) {
        stravaDescription += '\n\n' + makeRaceInfoString(currentActivity.raceInfo);
      } else if (currentActivity.workoutSets && currentActivity.workoutSets.length) {
        stravaDescription += '\n\n' + makeWorkoutString(currentActivity.workoutSets);
      }
  
      let params = new URLSearchParams({
        name: stravaTitle,
        type: 'run',
        start_date_local: currentActivity.dateTime,
        elapsed_time: currentActivity.secondsTime.toString(),
        description: stravaDescription,
        distance: currentActivity.meterDistance.toString(),
        gear_id: 'g6810985'
      });
  
      fetch(activityPostUrl + '?' + params, {
        method: 'POST',
        headers: {
          'Authorization': token
        }
      }).then(result => console.log(result));
    })

    // const options = {
    //   headers: new HttpHeaders().set('Authorization', token),
    //   params: new HttpParams()
    //     .set('name', stravaTitle)
    //     .set('type', 'run')
    //     .set('start_date_local', currentActivity.dateTime)
    //     .set('elapsed_time', currentActivity.secondsTime.toString())
    //     .set('description', stravaDescription)
    //     .set('distance', currentActivity.meterDistance.toString())
    //     .set('gear_id', 'g6810985'),
    // };

    // console.log("posting")
    // this.http.post<FullActivity>(activityPostUrl, options).pipe(first()).subscribe(result => console.log(result));
  }
}
