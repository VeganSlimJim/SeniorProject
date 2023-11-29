import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { AppComponent } from './app.component';
import { LineGraphComponent } from './components/line-graph/line-graph.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
import { AppRoutingModule } from './app-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './components/sidenav/sidenav.component';
@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AgGridModule,
    LineGraphComponent,
    BrowserAnimationsModule,
    NavbarComponent,
    LoginpageComponent,
    AppRoutingModule,
    MatSidenavModule,
    SidenavComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
