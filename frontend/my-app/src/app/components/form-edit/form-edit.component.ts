import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { DataService } from 'src/app/services/data/data.service';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { FormDataService } from 'src/app/services/form-data/form-data.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export default interface FormEdit {
  panel_number: string;
  numberPhases: string;
  amps: string;
  ab: string;
  latestReading: string;
  name_notes_detail: string;
  kW_capacity: string;
  kW_reading: string;
  percent_of_breaker: string;
}
@Component({
  selector: 'app-form-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './form-edit.component.html',
  styleUrl: './form-edit.component.css',
})
export class FormEditComponent {
  formPanel: string;
  formEditData: FormEdit;

  constructor(
    private formDataService: FormDataService,
    private cookieService: CookieService,
    private router: Router,
    private dataService: DataService
  ) {
    this.formPanel = '';

    this.formEditData = {
      panel_number: '',
      numberPhases: '',
      amps: '',
      ab: '',
      latestReading: '',
      name_notes_detail: '',
      kW_capacity: '',
      kW_reading: '',
      percent_of_breaker: '',
    };
  }

  ngOnInit() {
    this.formDataService.getFormPanel().subscribe((value) => {
      this.formPanel = value;
      if (!value) {
        this.formPanel = this.cookieService.get('panelNumber');
      }
    });
    this.formDataService.setFormSubmitSuccess(false);
  }

  onCancelClick() {
    this.router.navigate(['reporting']);
  }

  onSubmitClick() {
    this.formEditData.panel_number = this.formPanel;
    console.log(this.formEditData);

    this.dataService.postPanel(this.formEditData).subscribe((value) => {
      if ('Success' in value) {
        this.formDataService.setFormSubmitSuccess(true);
        this.router.navigate(['/reporting']);
      }
    });
  }
}
