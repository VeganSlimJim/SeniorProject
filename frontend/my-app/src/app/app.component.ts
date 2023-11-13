import { Component } from '@angular/core';
import { DataService } from './data.service';

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
  title = 'my-app';

  constructor(private dataService: DataService){};

  ngOnInit(){}
}
