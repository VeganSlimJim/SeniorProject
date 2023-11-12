import { Component, ViewChild } from '@angular/core';
import { AgChartOptions, time } from 'ag-charts-community';
import { AgChartsAngular, AgChartsAngularModule } from 'ag-charts-angular';
import { DataService } from '../data.service';

//Component is standalone to modularize imports
@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css'],
  standalone: true,
  imports: [AgChartsAngularModule]
  
})
/**
 * This class creates our Line Grah Component
 */
export class LineGraphComponent {

  //tempData holds the Array of our data
  public tempData: Array<any>;

  //options holds the attributes of the graph
  public options: AgChartOptions;

  //ViewChild essentially watches the graph in order to update it when it changes
  @ViewChild(AgChartsAngular)
  public agChart!: AgChartsAngular;


  /**
   * Constructor for the Line Graph Component
   * @param dataService - The service that executes our http requests for the graph
   */
  constructor(private dataService: DataService) {

    //initialize tempdata to an empty array
    this.tempData = []

    
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
            text: "Timestamp"
          }
        },
        {
          type: 'number',
          position: 'left',
          label: {
            format: '#{.2f}Amps',
          },
          title: {
            text: "Current"
          }
        },
      ],
      title: {
        text: 'Current Readings from PLC',
      },
    };

  }


  ngOnInit() {
    this.dataService.getInitialData()
    .subscribe(value =>{
      var temp: Array<any> = JSON.parse(value);
      this.tempData = temp.filter(function(el, index) {
        return index >= temp.length - 10;
      })
      
  
    })
    this.startUpdates();
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

    if(this.tempData.length >=10){
      this.tempData.shift();
    }

    this.dataService.getDataFromPLC()
      .subscribe(value =>{
        this.tempData.push({
          time: new Date(value.timestamp),
          current: value.value,
          
        })
      })
   
    
   
    return this.tempData;
  }
  
}





