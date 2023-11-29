import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginpageComponent } from "./loginpage/loginpage.component";
import { LineGraphComponent } from "./line-graph/line-graph.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { ReportingComponent } from "./reporting/reporting.component";
const routes: Routes = [
    {path: 'login', component: LoginpageComponent},
    {path: 'dashboard', component: LineGraphComponent},
    {path: '', pathMatch: "full", redirectTo: 'dashboard'},
    {path: 'reporting', component: ReportingComponent},
    
    
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule{}