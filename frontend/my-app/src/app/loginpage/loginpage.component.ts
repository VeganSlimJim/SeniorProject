import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input'
import {MatCardModule} from '@angular/material/card'
import {FlexLayoutModule} from '@angular/flex-layout'

@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule, MatCardModule, FlexLayoutModule, ReactiveFormsModule],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.css'
})
export class LoginpageComponent {
  username: string = ""
  password: string = ""
  show: boolean = false;
  public loginForm!: FormGroup;

  constructor(){}

  ngOnInit(){
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  handleLoginFormSubmit(){
    console.log(`Username: ${this.username}, password: ${this.password}`)
  }

}
