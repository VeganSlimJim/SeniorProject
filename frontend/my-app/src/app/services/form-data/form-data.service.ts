import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormDataService {
  private formPanel: BehaviorSubject<string> = new BehaviorSubject('');
  private formSubmitSuccess: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  constructor() {}

  getFormPanel(): Observable<string> {
    return this.formPanel.asObservable();
  }

  setFormPanel(formPanel: string) {
    this.formPanel.next(formPanel);
  }

  getFormSubmitSucces(): Observable<boolean> {
    return this.formSubmitSuccess.asObservable();
  }

  setFormSubmitSuccess(formSubmitSuccess: boolean) {
    this.formSubmitSuccess.next(formSubmitSuccess);
  }
}
