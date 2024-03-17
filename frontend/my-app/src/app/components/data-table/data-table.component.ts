import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
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

  private gridApi!: GridApi;

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

  onBtnExport() {
    this.gridApi.exportDataAsCsv();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
