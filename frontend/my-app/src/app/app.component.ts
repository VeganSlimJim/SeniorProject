import { Component } from '@angular/core';
import { DataService } from './data.service';
import { RouterService } from './router.service';
import {Router} from '@angular/router'
import { SidenavStatusService } from './sidenav-status.service';
//The interface for our JSON objects
interface DataModel{
  timestamp: String
  value: Number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
//Base appcomponent app, operations that should execute first would go here
export class AppComponent {
  sideNavOpened = false;
  title = 'my-app';
  router: string;

  constructor(private dataService: DataService, private _router: Router, private routerService: RouterService, private sideNavStatusService: SidenavStatusService){
    this.router = _router.url
    console.log(this.router)
  };

  toggleSidenav(){
    this.sideNavOpened = !this.sideNavOpened;
    console.log("toggled");
  }

  ngOnInit(){
    this.routerService.getRouterUrl().subscribe(value =>{
      this.router = value;
      console.log(value);
    });

    this.sideNavStatusService.getSideNavState().subscribe(value =>{
      this.sideNavOpened = value;
    })
  }
}
