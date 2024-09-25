import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  storedData: any
  loginForm: FormGroup;
  private router = inject(Router) // preguntar si se puede hacer de otra manera.
  private _snackBar = inject(MatSnackBar)

  constructor(private fb: FormBuilder) { 
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      pass: ['', Validators.required],
    });
    
    const data = localStorage.getItem('registerData');
    this.storedData = data ? JSON.parse(data) : null;
  }

  hasErrors(controlName: string, errorType: string) {
    return this.loginForm.get(controlName)?.hasError(errorType) && this.loginForm.get(controlName)?.touched;
  }

  
  submit() {
    const { user, pass } = this.loginForm.value;
    if (this.isUserValid(user, pass)) {
      this.router.navigate([''])
      console.log('Inicio de sesión exitoso')
    } else {
      this.openSnackBar('Error, ingrese una credencial válida')
      console.log('Credenciales inválidas')
    }
  }

  private isUserValid(user: string, pass: string): boolean {
    if (!this.storedData) {
      return false
    }
    return this.storedData.some((storedUser: any) => {
      return (storedUser.user === user || storedUser.mail === user) && storedUser.pass === pass;
    })
  }

  openSnackBar(message: string) {
    this._snackBar.open(message)
  }
}
