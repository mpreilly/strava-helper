import { Component, OnInit } from '@angular/core';
import { readActivitiesFromR2WFile } from '../read-activity-objects';

@Component({
  selector: 'app-r2w-activities',
  templateUrl: './r2w-activities.component.html',
  styleUrls: ['./r2w-activities.component.css']
})
export class R2wActivitiesComponent implements OnInit {
  fileToUpload: File = null;

  constructor() { }

  ngOnInit(): void {
    // this.readFiles()
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileToUpload.text().then(data => readActivitiesFromR2WFile(data));
  }

}
