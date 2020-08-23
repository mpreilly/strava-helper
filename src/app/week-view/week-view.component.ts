import { Component, OnInit, Input } from '@angular/core';

import { FullActivity } from '../full-activity';
import { WeekMileage } from '../week-mileage';

@Component({
  selector: 'app-week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.css']
})
export class WeekViewComponent implements OnInit {

  @Input() activities: FullActivity[];
  startOnMonday = true;
  weeklyMileage: WeekMileage[] = [];

  constructor() {
  }

  getWeekStartDate(activityStart: string): Date {
    var date = new Date(activityStart);
    if (this.startOnMonday && date.getDay() === 0) {
      date.setDate(date.getDate() - 6);
    } else if (this.startOnMonday) {
      date.setDate(date.getDate() - date.getDay() + 1);
    } else {
      date.setDate(date.getDate() - date.getDay());
    }

    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);

    return date;
  }

  ngOnInit(): void {
    // var date1 = new Date(this.activities[0].start_date_local);
    // console.log("date1: " + date1);
    // var date2 = new Date(date1);
    // date2.setDate(date1.getDate() - 28);
    // console.log("date2: " + date2)

    // var differenceInDays = (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
    // console.log(differenceInDays)

    this.weeklyMileage.push({
      startDate: this.getWeekStartDate(this.activities[0].start_date_local),
      mileage: 0
    });

    this.activities.forEach( (activity: FullActivity) => {
      const activityDate: Date = new Date(activity.start_date_local);

      // if current activity doesn't fit into current week, make new week
      if (this.weeklyMileage[this.weeklyMileage.length - 1].startDate > activityDate) {

        // if there is more than a week between the beginning of the current week and the new activity,
        // we need to add in an empty week
        while ((this.weeklyMileage[this.weeklyMileage.length - 1].startDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24) > 7) {
          var newDate = new Date(this.weeklyMileage[this.weeklyMileage.length - 1].startDate);
          newDate.setDate(newDate.getDate() - 7);
          this.weeklyMileage.push({
            startDate: newDate,
            mileage: 0
          });
        }

        this.weeklyMileage.push({ 
          startDate: this.getWeekStartDate(activity.start_date_local),
          mileage: activity.distance * 0.000621371
        })
      } else {
        this.weeklyMileage[this.weeklyMileage.length - 1].mileage += activity.distance * 0.000621371;
      }
    })

    console.log(this.weeklyMileage);
  }

}
