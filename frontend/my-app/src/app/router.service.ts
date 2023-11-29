import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  private router_url: BehaviorSubject<string> = new BehaviorSubject("");

  constructor() { }

  getRouterUrl(): Observable<string> {
    return this.router_url.asObservable();
  }

  setRouterUrl(router_url: string) {
    this.router_url.next(router_url);
  }
}
