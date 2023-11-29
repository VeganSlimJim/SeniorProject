import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable,from } from 'rxjs';
import vars from '../../../../vars.json';


//mark this class as injectable so it can be injected as a dependancy elsewhere
@Injectable({
  providedIn: 'root'
})
//this class creates the data service that executes http requests
export class DataService {

  //default constructor
  constructor() { }

  /**
   * Gets a reading from the PLC
   * @returns - an observable of the json object of our data
   */
  getDataFromPLC(token: string) : Observable<any> {
    const headers = {
      "Authorization": `Bearer ${token}`
    }
    //request a reading from the api
    //                                      CHANGE THIS PATH to "/api/data/new" UNLESS TESTING with the "/testapi/data/new" VERSION
    const data = axios.get(`${vars.base_path}/api/v1/data/testnew`, {
      headers: headers
    })
      .then(async (res) =>{
        return await res.data;
      })
      //return an observable of the data
      return from(data);

  }
  /**
   * Debateably useless since it ruins the graph for a bit, fetches the last 10 rows of the mysql table
   * @returns - an observable of the json object of our data
   */
  getInitialData(): Observable<any>{
    const data = axios.get(`${vars.base_path}/api/data/load`)
      .then(async (res) =>{
        return await res.data;
      })
      //return the observable
      return from(data);
  }
}
