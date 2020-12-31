import { Component, OnInit } from '@angular/core';
import { readActivitiesFromR2WFile, makeRaceInfoString, makeWorkoutString } from '../read-activity-objects';
import { R2WActivity, RaceInfo, WorkoutSet } from '../r2w-activity';
import { ActivitiesService } from '../activities.service';

@Component({
  selector: 'app-r2w-activities',
  templateUrl: './r2w-activities.component.html',
  styleUrls: ['./r2w-activities.component.css']
})
export class R2wActivitiesComponent implements OnInit {
  // fileToUpload: File = null;
  activities: R2WActivity[] = [];
  activitiesToUpload: R2WActivity[] = [];

  constructor(private activitesService: ActivitiesService) { }

  ngOnInit(): void {
  }

  handleFileInput(files: FileList): void {
    // this.fileToUpload = files.item(0);
    for (let i = 0; i < files.length; i++) {
      files.item(i).text().then(data => {
        this.activities.push(...readActivitiesFromR2WFile(data));
      });
    }
    console.log(this.activities);
    this.activitiesToUpload = this.activities;
    // this.fileToUpload.text().then(data => {
    //   this.activities = readActivitiesFromR2WFile(data);
    //   console.log(this.activities);
    // });
  }

  uploadActivities(): void {
    console.log('calling upload');
    this.activitesService.uploadActivities(this.activities);
  }

  uploadSingleActivity(activity: R2WActivity): void {
    this.activitesService.uploadActivities([activity]);
  }

  getWorkoutString(workoutSets: WorkoutSet[]): string {
    return makeWorkoutString(workoutSets);
  }

  getRaceInfoString(raceInfo: RaceInfo): string {
    return makeRaceInfoString(raceInfo);
  }

}
