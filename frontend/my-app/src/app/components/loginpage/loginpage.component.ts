import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthService } from '../../services/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { RouterService } from '../../services/router/router.service';
import { ErrorStateMatcher } from '@angular/material/core';
interface Token {
  token: string;
  user_role: string;
}

export class MyErroStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: AbstractControl<any, any> | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || isSubmitted));
  }
}
@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.css',
})
export class LoginpageComponent {
  show: boolean = false;
  invalidLogin: boolean = false;
  router_url: string;
  matcher = new MyErroStateMatcher();
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private routerService: RouterService
  ) {
    this.router_url = router.url;
    this.routerService.setRouterUrl(this.router_url);
  }

  ngOnInit() {
    if (this.cookieService.get('token')) {
      this.router.navigate(['/dashboard']);
    }
  }

  handleLoginFormSubmit() {
    this.authService
      .login(this.email.value!, this.password.value!)
      .subscribe((value: Token) => {
        try {
          this.invalidLogin = false;
          this.cookieService.set('token', value.token);
          this.authService.setCurrUserRole(value.user_role);
          this.router.navigate(['/dashboard']);
        } catch (error) {
          this.invalidLogin = true;
        }
      });
  }
}
