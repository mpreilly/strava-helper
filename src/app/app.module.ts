import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActivitiesComponent } from './activities/activities.component';
import { WeekViewComponent } from './week-view/week-view.component';
import { R2wActivitiesComponent } from './r2w-activities/r2w-activities.component';

@NgModule({
  declarations: [
    AppComponent,
    ActivitiesComponent,
    WeekViewComponent,
    R2wActivitiesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
