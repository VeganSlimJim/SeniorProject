import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppRoutingModule } from '../../app-routing.module';
import { MatCardModule } from '@angular/material/card';
import { SidenavStatusService } from '../../services/sidenav-status/sidenav-status.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, AppRoutingModule, MatCardModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent implements OnChanges {
  @Input() opened = false;
  currval: any;

  showUserFunctions: boolean = false;
  userRole: string;

  constructor(
    private sideNavStatusService: SidenavStatusService,
    private elementRef: ElementRef,
    private cookieService: CookieService,
    private authService: AuthService
  ) {
    this.userRole = '';
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['opened']) {
      console.log(changes['opened'].currentValue);
    }
  }

  ngOnInit() {
    console.log('im initializing the sidenav');

    this.authService.getCurrUserRole().subscribe((value) => {
      this.userRole = value;
      if (this.userRole === 'ADMIN') {
        this.showUserFunctions = true;
      }
    });
  }

  toggleStatus() {
    console.log('hi everyone from backdrop');
    this.sideNavStatusService.getSideNavState().subscribe((value) => {
      this.currval = value;
      console.log('Side nav state is now ' + this.currval);
    });
    this.sideNavStatusService.setSideNavStatus(!this.currval);
  }
  @HostListener('document:click', ['$event'])
  onBackdropClick(event: MouseEvent) {
    const backdrop = document.querySelector(
      '.mat-drawer-backdrop'
    ) as HTMLElement;
    if (backdrop && backdrop.contains(event.target as Node)) {
      this.sideNavStatusService.getSideNavState().subscribe((value) => {
        this.currval = value;
      });
      this.sideNavStatusService.setSideNavStatus(!this.currval);
    }
  }
}
