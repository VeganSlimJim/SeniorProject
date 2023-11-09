import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { AppComponent } from './app.component';
import { LineGraphComponent } from './line-graph/line-graph.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AgGridModule,
    LineGraphComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
