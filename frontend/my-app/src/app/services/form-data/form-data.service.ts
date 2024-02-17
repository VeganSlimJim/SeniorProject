import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formPanel: BehaviorSubject<string> = new BehaviorSubject("");


  constructor() { }

  getFormPanel(): Observable<string>{
    return this.formPanel.asObservable();
  }

  setFormPanel(formPanel: string){
    this.formPanel.next(formPanel);
  }
}
