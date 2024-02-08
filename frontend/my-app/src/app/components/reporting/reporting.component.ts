import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { DataService } from 'src/app/services/data/data.service';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule, ReactiveFormsModule,FormControl, Validators} from '@angular/forms';

interface Report{
  timestamp: string | null,
  phase: string | null,
  amps: string | null,
  kw_capacity: string | null,
}
@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './reporting.component.html',
  styleUrl: './reporting.component.css'
})
export class ReportingComponent {
  curr_report_values: Report;
  csvRows: Array<any>;
  phase: FormControl;

  

  constructor(private dataService: DataService, private cookieService: CookieService){
    this.curr_report_values = {
      timestamp: null,
      phase: null,
      amps: null,
      kw_capacity: null,
    };

    this.csvRows = [];
    this.phase = new FormControl('', [
      Validators.required
    ])
  };

  handleReportingFormSubmit(){
    const token = this.cookieService.get('token');
    
    this.dataService.getDataFromPLCForReport(this.phase.value, token!)
    .subscribe(value =>{
      console.log(value);
      this.curr_report_values.timestamp = value.timestamp;
      this.curr_report_values.amps = value.value;
      this.curr_report_values.phase = value.phase;
      this.curr_report_values.kw_capacity = value.kw_capacity_reading;

      

      
      console.log(this.curr_report_values);
      const csvData = this.buildCSV(this.curr_report_values);
      console.log("i made it here");
      this.download(csvData);
    })

    

  }


   /**
   * Build a csv from a data source
   * @param data - THe array of json objects
   * @returns - csv data rows joined by a new line
   */
   buildCSV(data: any){

    //Set the headers of the csv file to be equal to the keys of the json objects
    //we can replace these with hard coded values as well

    const headers = Object.keys(data);
    console.log("i made it");
    //replace this line with a string like: current,time,whatever to add the headers as needed
    this.csvRows.push(headers.join(','));

    //add each json entry into the data source    
    this.csvRows.push(Object.values(data).join(','));
    

    //return the csv rows joined by a new line
    return this.csvRows.join('\n');
    

  }


  /**
   * Handles thee actual download of the csv file
   * @param data - The data source
   */
  download(data: any){
    const blob = new Blob([data]);
    
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.setAttribute('href', url);

    a.setAttribute('download', 'download.csv');

    a.click();

  }
}