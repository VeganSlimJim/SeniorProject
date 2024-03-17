import { Component, ViewChild } from '@angular/core';
import { AgChartOptions, time } from 'ag-charts-community';
import { AgChartsAngular, AgChartsAngularModule } from 'ag-charts-angular';
import { DataService } from '../../services/data/data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CookieService } from 'ngx-cookie-service';
import { RouterService } from 'src/app/services/router/router.service';
import { Router } from '@angular/router';
//Component is standalone to modularize imports
@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css'],
  standalone: true,
  imports: [
    AgChartsAngularModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
})
/**
 * This class creates our Line Grah Component
 */
export class LineGraphComponent {
  public cookieValue: string;

  //tempData holds the Array of our data
  public tempData: Array<any>;
  csvRows: Array<any>;

  //options holds the attributes of the graph
  public options: AgChartOptions;

  //ViewChild essentially watches the graph in order to update it when it changes
  @ViewChild(AgChartsAngular)
  public agChart!: AgChartsAngular;

  /**
   * Constructor for the Line Graph Component
   * @param dataService - The service that executes our http requests for the graph
   */
  constructor(
    private dataService: DataService,
    private cookieService: CookieService,
    private router: Router,
    private routerService: RouterService
  ) {
    this.routerService.setRouterUrl(this.router.url);

    this.cookieValue = '';
    //initialize csvrows data
    this.csvRows = [];

    //initialize tempdata to an empty array
    this.tempData = [];

    //define the options for the graph
    this.options = {
      autoSize: true,
      data: this.getData(),
      series: [
        {
          xKey: 'time',
          yKey: 'current',
        },
      ],
      axes: [
        {
          type: 'time',
          position: 'bottom',
          nice: false,
          tick: {
            interval: time.second.every(2),
          },
          label: {
            format: '%H:%M:%S',
          },
          title: {
            text: 'Timestamp',
          },
        },
        {
          type: 'number',
          position: 'left',
          label: {
            format: '#{.2f}Amps',
          },
          title: {
            text: 'Current',
          },
        },
      ],
      title: {
        text: 'Current Readings from PLC',
      },
    };
  }

  ngOnInit() {
    // this.dataService.getInitialData()
    // .subscribe(value =>{
    //   var temp: Array<any> = JSON.parse(value);
    //   this.tempData = temp.filter(function(el, index) {
    //     return index >= temp.length - 10;
    //   })

    // })
    this.cookieValue = this.cookieService.get('token');
    console.log(this.cookieValue);
    if (!this.cookieValue) {
      this.router.navigate(['/login']);
    }
    // this.startUpdates();
  }

  update = () => {
    const options = { ...this.options };

    options.data = this.getData();

    this.options = options;
  };

  startUpdates = () => {
    //@ts-ignore
    this.update();
    //@ts-ignore
    setInterval(this.update, 2000);
  };

  getData() {
    if (this.tempData.length >= 10) {
      this.tempData.shift();
    }

    // this.dataService.getDataFromPLC(this.cookieValue)
    //   .subscribe(value =>{
    //     this.tempData.push({
    //       time: new Date(value.timestamp),
    //       current: value.value,

    //     })
    //   })

    return this.tempData;
  }

  /**
   * Build a csv from a data source
   * @param data - THe array of json objects
   * @returns - csv data rows joined by a new line
   */
  buildCSV(data: any) {
    //Set the headers of the csv file to be equal to the keys of the json objects
    //we can replace these with hard coded values as well

    const headers = Object.keys(data[0]);

    //replace this line with a string like: current,time,whatever to add the headers as needed
    this.csvRows.push(headers.join(','));

    //add each json entry into the data source
    for (let i = 0; i < data.length; i++) {
      this.csvRows.push(Object.values(data[i]).join(','));
    }

    //return the csv rows joined by a new line
    return this.csvRows.join('\n');
  }

  //function that handles the click of the download button
  handleCSVClick() {
    const data = this.options.data;

    const csvData = this.buildCSV(data);
    this.download(csvData);
  }

  /**
   * Handles thee actual download of the csv file
   * @param data - The data source
   */
  download(data: any) {
    const blob = new Blob([data]);

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.setAttribute('href', url);

    a.setAttribute('download', 'download.csv');

    a.click();
  }
}
