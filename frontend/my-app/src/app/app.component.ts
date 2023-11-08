import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  value: String = "";

  constructor(private dataService: DataService){};

  fetchData(){
    this.dataService.getDataFromPLC()
    .subscribe(value =>{
      this.value = value.data;
      console.log(this.value);
    })
  }
}
