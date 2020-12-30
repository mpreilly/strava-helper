import { Component, OnInit } from '@angular/core';
import { readActivitiesFromR2WFile } from '../read-activity-objects';
import { R2WActivity, RaceInfo, WorkoutSet } from '../r2w-activity';

@Component({
  selector: 'app-r2w-activities',
  templateUrl: './r2w-activities.component.html',
  styleUrls: ['./r2w-activities.component.css']
})
export class R2wActivitiesComponent implements OnInit {
  fileToUpload: File = null;
  activities: R2WActivity[];

  constructor() { }

  ngOnInit(): void {
  }

  handleFileInput(files: FileList): void {
    this.fileToUpload = files.item(0);
    this.fileToUpload.text().then(data => {
      this.activities = readActivitiesFromR2WFile(data);
      console.log(this.activities);
    });
  }

  makeWorkoutString(workoutSets: WorkoutSet[]): string {
    let workoutString = 'Workout:\n\n';
    workoutSets.forEach(set => {
      workoutString += `Set ${set.setNum}: ${set.numReps} x ${set.distance} @ ${set.goal}\n${set.actual}\nRep rest ${set.repRest}${set.setRest ? ', Set rest ' + set.setRest : '' } \n\n`;
    });
    return workoutString;
  }

  makeRaceInfoString(raceInfo: RaceInfo): string {
    return `Race: ${raceInfo.raceName}\nDistance: ${raceInfo.distance}\nTime: ${raceInfo.time}\nSplits: ${raceInfo.splits}\nPlace: ${raceInfo.place}\nRace Description: ${raceInfo.comments}`;
  }

}
