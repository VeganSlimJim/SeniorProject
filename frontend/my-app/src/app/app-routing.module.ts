import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginpageComponent } from "./loginpage/loginpage.component";
import { LineGraphComponent } from "./line-graph/line-graph.component";
const routes: Routes = [
    {path: '', redirectTo : '/login', pathMatch: 'full'},
    {path: 'login', component: LoginpageComponent},
    {path: 'dashboard', component: LineGraphComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule{}