import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { DataService } from 'src/app/services/data/data.service';
import { ChangeDetectorRef } from '@angular/core';

interface RowData {
  name: string;
  time_of_reading: string;
  phase_number: string;
  amps: string;
  AB: string;
  latest_reading: string;
  name_notes_detail: string;
  kW_capacity: string;
  kW_reading: string;
  percent_of_breaker: string;
}
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent {
  rows: Array<RowData> = [];

  // rowData = [
  //   { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  //   { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  //   { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
  // ];

  // Column Definitions: Defines & controls grid columns.
  // colDefs1: ColDef[] = [
  //   { field: 'make' },
  //   { field: 'model' },
  //   { field: 'price' },
  //   { field: 'electric' },
  // ];

  colDefs: ColDef[] = [
    { field: 'name' },
    { field: 'time_of_reading' },
    { field: 'phase_number' },
    { field: 'amps' },
    { field: 'AB' },
    { field: 'latest_reading' },
    { field: 'name_notes_detail' },
    { field: 'kW_capacity' },
    { field: 'kW_reading' },
    { field: 'percent_of_breaker' },
  ];

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dataService.getAllPanels().subscribe((value) => {
      const retrievedRows = value.data;

      this.rows = retrievedRows;
    });
  }
}
