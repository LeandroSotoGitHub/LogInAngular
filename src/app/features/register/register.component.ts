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
  passwordStrengthMessage: string = ''
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

  // metodos para html
  checkPasswordStrength() {
    if (this.passwordStrength === 5) {
      this.passwordStrengthMessage = 'Contraseña fuerte';
    } else if (this.passwordStrength === 4) {
      this.passwordStrengthMessage = 'Contraseña aceptable';
    } else {
      this.passwordStrengthMessage = 'Contraseña débil';
    }
  }
  onStrengthChange(strength: number): void {
    this.passwordStrength = strength
    this.checkPasswordStrength()
  }

  hasError(controlName: string): string | null {
    const control = this.registerForm.get(controlName)

    let message: string | null = null

    if (control?.touched && control?.errors){
      switch (controlName){
        case 'user':
          if (control.hasError('required')) {
            message = 'El campo es obligatorio';
          } else if (control.hasError('usernameExists')) {
            message = 'Este nombre de usuario ya está en uso';
          } else if (control.hasError('specialCharNumber')) {
            message = 'El nombre de usuario debe contener al menos un número y un carácter especial';
          }
          break;

          case 'name':
            case 'surname':
            if(control.hasError('required')){
              message = 'El campo es obligatorio'
            }
            break
            
          case 'mail':
            if (control.hasError('required')) {
              message = 'El campo es obligatorio';
            } else if (control.hasError('email')) {
              message = 'Formato inválido';
            }
            break;
      
          case 'pass':
            if (control.hasError('required')) {
              message = 'El campo es obligatorio';
            } else if (control.hasError('minlength')) {
              message = 'Caracteres mínimos: 7';
            } else if (control.hasError('weakPassword')) {
              message = 'La contraseña debe ser fuerte (4 o más puntos).';
            }
            break;
      
            default:
              break;
      }
    }
    return message;
  }

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

      // ngOnDestroy, para limpiar el formulario.
      this.openSnackBar('Enviado con éxito!')
    } else {
    this.openSnackBar('Error, corrige los campos')
    }
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
