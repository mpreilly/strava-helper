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
    startOnMonday: boolean = true;
    weeklyMileage: WeekMileage[] = [];
    currentWeek: FullActivity[] = [];

    barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    barChartLabels = [];
    barChartType = 'bar';
    barChartLegend = false;
    barChartData = [
        {data: [], label: 'Mileage'}
    ];

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

    fillChartData(): void {
        this.weeklyMileage.forEach( (week: WeekMileage) => {
            this.barChartLabels.push(week.startDate.toLocaleDateString());
            this.barChartData[0].data.push(week.mileage);
        });
        this.barChartLabels.reverse();
        this.barChartData[0].data.reverse();
    }

    fixCurrentWeek(): void {
        this.currentWeek.reverse();
        while (this.currentWeek.length < 7) {
            this.currentWeek.push(null);
        }

        for (let i: number = 6; i >= 0; i--) {
            if (this.currentWeek[i] != null) {
                const activityDate: Date = new Date(this.currentWeek[i].start_date_local);
                const weekIndex: number = activityDate.getDate() - this.getWeekStartDate(this.currentWeek[i].start_date_local).getDate();

                if (weekIndex !== i) {
                    let temp: FullActivity = this.currentWeek[weekIndex];
                    this.currentWeek[weekIndex] = this.currentWeek[i];
                    this.currentWeek[i] = temp;
                }
            }

        }
    }

    ngOnInit(): void {
        this.weeklyMileage.push({
            startDate: this.getWeekStartDate(this.activities[0].start_date_local),
            mileage: 0
        });

        this.activities.forEach( (activity: FullActivity) => {
            activity.distance = activity.distance * 0.000621371;

            const activityDate: Date = new Date(activity.start_date_local);

            if (activityDate > this.weeklyMileage[0].startDate) {
                this.currentWeek.push(activity);
            }

            // if current activity doesn't fit into current week, make new week
            if (this.weeklyMileage[this.weeklyMileage.length - 1].startDate > activityDate) {

                // if there is more than a week between the beginning of the current week and the new activity,
                // we need to add in empty weeks until we're good
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
                    mileage: activity.distance
                })

            } else {
                this.weeklyMileage[this.weeklyMileage.length - 1].mileage += activity.distance;
            }
        })

        this.fillChartData();     
        this.fixCurrentWeek();   
    }

}
