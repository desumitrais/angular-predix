import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TagComponent } from './tags/tag.component';
import { DataPointComponent } from './datapoint/datapoint.component';
import { PageNotFoundComponent } from './not-found.component';

const appRoutes: Routes = [
  { path: 'tags', component: TagComponent },
  { path: 'datapoints', component: DataPointComponent },
  { path: '',   redirectTo: '/tags', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TagComponent,
    DataPointComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
