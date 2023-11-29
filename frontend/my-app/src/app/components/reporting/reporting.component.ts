import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { DataService } from 'src/app/services/data/data.service';
import { FormsModule, ReactiveFormsModule,FormControl, Validators} from '@angular/forms';
@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './reporting.component.html',
  styleUrl: './reporting.component.css'
})
export class ReportingComponent {

  phase = new FormControl('', [
    Validators.required
  ])

  constructor(private dataService: DataService){};

  handleReportingFormSubmit(){

    

  }
}
