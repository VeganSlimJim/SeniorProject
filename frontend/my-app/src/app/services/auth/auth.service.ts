import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from } from 'rxjs';
import vars from '../../../../vars.json'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login(email: string, password: string) : Observable<any>{

    //post to the auth api

    const payload = {
      email: email,
      password: password
    }


    const data = axios.post(`${vars.base_path}/api/v1/auth/login`, payload)
      .then(async (res) =>{
        if(res.status !== 200){
          console.log("in the return");
          return null;
        }
        console.log("made it here somehow");
        return await res.data
      }).catch(error =>{
        console.log("erroreed out");
        return null;
      })
      
      return from(data);
  }
}
