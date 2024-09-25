import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { usernameExistsValidator, usernameValidator } from 'src/app/shared/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup
  passwordStrength: number = 0
  private _snackBar = inject(MatSnackBar)


  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      user: ['', [Validators.required, usernameValidator(), usernameExistsValidator()]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      pass: ['', [Validators.required, Validators.minLength(7)]],
      mail: ['', [Validators.required, Validators.email]]
    })
  }

  onStrengthChange(strength: number): void {
    this.passwordStrength = strength;
  }

  hasErrors(controlName: string, errorType: string) {
    return this.registerForm.get(controlName)?.hasError(errorType) && this.registerForm.get(controlName)?.touched;
  }

  // SWITCH SEGUN CONTROL NAME

  submit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value
      // Recuperar usuarios existentes de Local Storage
      const existingUsers = JSON.parse(localStorage.getItem('registerData') || '[]')


      //comprobar si ya hay un usuario con ese nombre
      const userExists = existingUsers.some((user: any) => user.user.toLowerCase() === formData.user.toLowerCase());
      if (userExists) {
        this.openSnackBar('Este nombre de usuario ya está en uso')
        return
      }
      // Agregar el nuevo usuario a la lista
      existingUsers.push(formData)

      
      // Guardar la lista actualizada en Local Storage
      localStorage.setItem('registerData', JSON.stringify(existingUsers))
      console.log('Datos guardados en Local Storage:', existingUsers)

      // ngOnDestroy, para limpiar el formulario.
      this.openSnackBar('Enviado con éxito!')
    } else {
    this.openSnackBar('Error, corrige los campos')
    }
    console.log('Formulario:', this.registerForm)
    console.log('Estado del formulario:', this.registerForm.valid)
    console.log('Errores del formulario:', this.registerForm.errors)
  }

  openSnackBar(message: string) {
    this._snackBar.open(message)
  }
}
