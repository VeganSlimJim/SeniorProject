import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable,from } from 'rxjs';
import vars from '../../vars.json';

interface PLCData {
  value : Number
}
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }


  getDataFromPLC() : Observable<any> {
    console.log("im here");
    const data = axios.get(`${vars.base_path}/api/data/new`)
      .then(async (res) =>{
        return await res.data;
      })

     

      return from(data);

  }

  getInitialData(): Observable<any>{
    const data = axios.get(`${vars.base_path}/api/data/load`)
      .then(async (res) =>{
        return await res.data;
      })

      return from(data);
  }
}
