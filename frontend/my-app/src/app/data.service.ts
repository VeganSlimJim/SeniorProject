import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable,from } from 'rxjs';


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
    const data = axios.get("http://localhost:4000/api/data/new")
      .then(async (res) =>{
        return await res.data;
      })

     

      return from(data);

  }
}
