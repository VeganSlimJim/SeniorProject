import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
import { LineGraphComponent } from './components/line-graph/line-graph.component';
import { ReportingComponent } from './components/reporting/reporting.component';
import { FormEditComponent } from './components/form-edit/form-edit.component';
import { DataTableComponent } from './components/data-table/data-table.component';
const routes: Routes = [
  { path: 'login', component: LoginpageComponent },
  { path: 'dashboard', component: LineGraphComponent },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'reporting', component: ReportingComponent },
  { path: 'reporting/edit', component: FormEditComponent },
  { path: 'table', component: DataTableComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
