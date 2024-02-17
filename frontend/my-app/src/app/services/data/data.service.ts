import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from } from 'rxjs';
import FormEdit from 'src/app/components/form-edit/form-edit.component';
import vars from '../../../../vars.json';

//mark this class as injectable so it can be injected as a dependancy elsewhere
@Injectable({
  providedIn: 'root',
})
//this class creates the data service that executes http requests
export class DataService {
  //default constructor
  constructor() {}

  /**
   * Gets a reading from the PLC
   * @returns - an observable of the json object of our data
   */
  getDataFromPLC(token: string): Observable<any> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    //request a reading from the api
    //                                      CHANGE THIS PATH to "/api/data/new" UNLESS TESTING with the "/testapi/data/new" VERSION
    const data = axios
      .get(`${vars.base_path}/api/v1/data/testnew`, {
        headers: headers,
      })
      .then(async (res) => {
        return await res.data;
      });
    //return an observable of the data
    return from(data);
  }
  /**
   * Gets a reading from the PLC with the new reporting format
   * @returns - an observable of the json object of our data
   */
  getDataFromPLCForReport(phase: string, token: string): Observable<any> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const body = {
      phase: phase,
    };
    //request a reading from the api
    //                                      CHANGE THIS PATH to "/api/data/new" UNLESS TESTING with the "/testapi/data/new" VERSION
    const data = axios
      .post(`${vars.base_path}/api/v1/data/testnewreportreading`, body, {
        headers: headers,
      })
      .then(async (res) => {
        return await res.data;
      });
    //return an observable of the data
    return from(data);
  }
  /**
   * Debateably useless since it ruins the graph for a bit, fetches the last 10 rows of the mysql table
   * @returns - an observable of the json object of our data
   */
  getInitialData(): Observable<any> {
    const data = axios
      .get(`${vars.base_path}/api/data/load`)
      .then(async (res) => {
        return await res.data;
      });
    //return the observable
    return from(data);
  }

  getPanels(): Observable<any> {
    const data = axios
      .get(`${vars.base_path}/api/v1/data/panels/get`)

      .then(async (res) => {
        return await res.data;
      });
    //return the observable
    return from(data);
  }

  getOnePanel(panel_number: string): Observable<any> {
    const body = {
      panel_number: panel_number,
    };
    const data = axios
      .post(`${vars.base_path}/api/v1/data/panels/getOne`, body)

      .then(async (res) => {
        return await res.data;
      });

    return from(data);
  }

  postPanel(panelData: FormEdit): Observable<any> {
    const body = {
      panel_number: panelData.panel_number,
      phase_number: panelData.numberPhases,
      amps: panelData.amps,
      ab: panelData.ab,
      latest_reading: panelData.latestReading,
      name_notes_detail: panelData.name_notes_detail,
      kW_capacity: panelData.kW_capacity,
      kW_reading: panelData.kW_reading,
      percent_of_breaker: panelData.percent_of_breaker,
    };

    console.log(body);
    const data = axios
      .post(`${vars.base_path}/api/v1/data/panels/insertOne`, body)
      .then(async (res) => {
        if (res.status === 200) {
          return await res.data;
        }
      });

    return from(data);
  }
}
