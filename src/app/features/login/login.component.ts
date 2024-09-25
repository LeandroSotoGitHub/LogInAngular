import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StoredUser } from 'src/app/shared/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  storedData: any
  loginForm: FormGroup
  hidePassword: boolean = true;
  private router = inject(Router) // preguntar si se puede hacer de otra manera.
  private _snackBar = inject(MatSnackBar)

  constructor(private fb: FormBuilder) { 
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      pass: ['', Validators.required],
    });
    
    const data = localStorage.getItem('registerData')
    this.storedData = data ? JSON.parse(data) : null
  }

  hasErrors(controlName: string, errorType: string) {
    return this.loginForm.get(controlName)?.hasError(errorType) && this.loginForm.get(controlName)?.touched
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  
  submit() {
    const { user, pass } = this.loginForm.value;
    
    if (this.isLoginValid(user, pass)) {

      //navegamos
      this.router.navigate([''])

      //seteamos
      this.setValidUser()

    } else {
      //manejamos error
      this.openSnackBar('Error, ingrese una credencial válida')
    }
  }



  // submit()
    //verificamos login
    private isLoginValid(user: string, pass: string): boolean {
      const foundUser = this.findUser(user)
      if (!foundUser) {
        return false
      }
      return this.isPasswordValid(foundUser, pass)
    }

      //encontramos usuario y lo verificamos
      private findUser(user: string) : StoredUser | null{
        if (!this.storedData){
          return null
        }
        return this.storedData.find((storedUser: StoredUser) =>
          this.isMatchingUser(storedUser, user)
      )} 

      // verificamos user o mail, lo pasamos x lowercase
          private isMatchingUser (storedUser: StoredUser, user:string): boolean{
            return storedUser.user.toLowerCase() === user.toLowerCase() || 
                  storedUser.mail.toLowerCase() === user.toLowerCase()
          }  

          // verificamos pass
          private isPasswordValid(storedUser: StoredUser, pass: string): boolean {
            return storedUser.pass === pass
          }

  //seteamos user en el local
  private setValidUser(){
    const validUser = this.storedData
    localStorage.setItem('loginData', JSON.stringify(validUser))
    console.log(validUser)
  } 

  private openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 5000, // Duración en milisegundos que el snackbar estará visible
      horizontalPosition: 'center', // Posición horizontal
      verticalPosition: 'top', // Posición vertical
    }).onAction().subscribe(() => {
      // Aquí puedes manejar cualquier acción que desees al hacer clic en el botón de cerrar
      console.log('SnackBar cerrado por el usuario.');
    });
  }
}
