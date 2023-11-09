import { Component } from '@angular/core';
import { DataService } from './data.service';


interface DataModel{
  timestamp: String
  value: Number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  value: String = "";
  initialDataObject : Array<DataModel> = []

  constructor(private dataService: DataService){};

  

  ngOnInit(){
    

  }
}
