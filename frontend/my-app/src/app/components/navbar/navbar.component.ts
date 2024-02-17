import { Component, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SidenavStatusService } from '../../services/sidenav-status/sidenav-status.service';
import { AppRoutingModule } from '../../app-routing.module';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatCheckboxModule,
    AppRoutingModule,
  ],
})
export class NavbarComponent {
  currval: any;
  @Output() sideNavToggle = new EventEmitter<void>();

  constructor(private sideNavStatusService: SidenavStatusService) {}

  toggleSideNav() {
    this.sideNavStatusService
      .getSideNavState()
      .subscribe((value) => {
        this.currval = value;
      })
      .unsubscribe();

    this.sideNavStatusService.setSideNavStatus(!this.currval);
  }
}
