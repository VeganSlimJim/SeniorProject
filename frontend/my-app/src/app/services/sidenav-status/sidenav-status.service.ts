import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavStatusService {
  private sideNavStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() { };

  getSideNavState(): Observable<boolean> {
    return this.sideNavStatus.asObservable();
  }

  setSideNavStatus(status: boolean) {
    this.sideNavStatus.next(status);
  }
}
