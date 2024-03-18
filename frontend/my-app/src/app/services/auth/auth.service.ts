import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable, from } from 'rxjs';
import vars from '../../../../vars.json';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currUserRole: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {}

  getCurrUserRole(): Observable<string> {
    return this.currUserRole.asObservable();
  }

  setCurrUserRole(currUserRole: string) {
    this.currUserRole.next(currUserRole);
  }

  login(email: string, password: string): Observable<any> {
    //post to the auth api

    const payload = {
      email: email,
      password: password,
    };

    const data = axios
      .post(`${vars.base_path}/api/v1/auth/login`, payload)
      .then(async (res) => {
        if (res.status !== 200) {
          console.log('in the return');
          return null;
        }
        console.log('made it here somehow');
        return await res.data;
      })
      .catch((error) => {
        console.log('erroreed out');
        return null;
      });

    return from(data);
  }

  decodeToken(token: String): Observable<any> {
    const payload = {
      token: token,
    };

    const data = axios
      .post(`${vars.base_path}/api/v1/auth/token-decode`, payload)
      .then(async (res) => {
        if (res.status !== 200) {
          console.log('nah');
          return null;
        }

        return await res.data;
      })
      .catch((error) => {
        console.log('errored out');
        return null;
      });

    return from(data);
  }
}
