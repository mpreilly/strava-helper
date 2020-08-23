import { Component, OnInit } from '@angular/core';

import { ActivitiesService } from '../activities.service';
import { FullActivity } from '../full-activity';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  activities: FullActivity[];

  constructor(private activitesService: ActivitiesService) { }

  getActivities(): void {
    this.activitesService.getActivities()
      .subscribe((data: FullActivity[]) => this.activities = data);
  }

  ngOnInit(): void {
    this.getActivities();
  }

}
