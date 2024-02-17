import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginpageComponent } from "./components/loginpage/loginpage.component";
import { LineGraphComponent } from "./components/line-graph/line-graph.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ReportingComponent } from "./components/reporting/reporting.component";
import { FormEditComponent } from "./components/form-edit/form-edit.component";
const routes: Routes = [
    {path: 'login', component: LoginpageComponent},
    {path: 'dashboard', component: LineGraphComponent},
    {path: '', pathMatch: "full", redirectTo: 'dashboard'},
    {path: 'reporting', component: ReportingComponent},
    {path: 'reporting/edit', component: FormEditComponent}
    
    
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule{}