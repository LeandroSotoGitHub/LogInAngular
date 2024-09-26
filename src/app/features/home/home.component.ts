import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { usernameExistsValidator, usernameValidator } from 'src/app/shared/validators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  homeForm: FormGroup
  loginData: any
  isEditing: boolean = false; // Nueva bandera para controlar el modo de edición
  successMessage: string | null = null; // Mensaje de éxito

  originalValue: any

  constructor(private fb: FormBuilder) {
    this.homeForm = this.fb.group({
      user: [{ value: '', disabled: true }, [Validators.required, usernameValidator(), usernameExistsValidator()]],
      name: [{ value: '', disabled: true }, Validators.required],
      surname: [{ value: '', disabled: true }, Validators.required],
      pass: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(7)]],
      mail: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
    });

    this.getLoginData()
    this.formPatcher()
  }

  private getLoginData() {
    const data = localStorage.getItem('loginData')
    this.loginData = data ? JSON.parse(data) : null
  }

  private formPatcher() {
    // Verifica si loginData no es nulo y es un objeto
    if (this.loginData) {
      this.homeForm.patchValue({
        user: this.loginData.user,
        name: this.loginData.name,
        surname: this.loginData.surname,
        pass: this.loginData.pass,
        mail: this.loginData.mail,
      });
    }
  }
  

  enableEditing(campo:string) {
    this.isEditing = true // Activar el modo de edición
    const control = this.homeForm.get(campo); // Obtener el control del campo específico

    if (control) {
      control.enable() // Habilitar el campo específico si existe
      this.successMessage = null; // Limpiar mensaje de éxito
    } else {
      console.error(`El campo ${campo} no existe en el formulario`); }
  }

  saveEditing(campo: string) {
    this.isEditing = false // Desactivar el modo de edición
    const control = this.homeForm.get(campo);
  
    if (control) {
      this.originalValue = control.value;
      control.disable() // Deshabilitar el campo de nuevo
  
      // Obtener los datos actuales del localStorage
      let loginData = localStorage.getItem('loginData')
      let storedData = loginData ? JSON.parse(loginData) : {}
  
      // Actualizar solo el campo editado
      storedData[campo] = control.value
  
      // Guardar los nuevos datos en el localStorage
      localStorage.setItem('loginData', JSON.stringify(storedData))
  
      this.successMessage = 'Cambios guardados exitosamente' // Mensaje de éxito
    } else {
      console.error(`El campo ${campo} no existe en el formulario`)
    }
  }

  cancelEditing(campo: string) {
    this.isEditing = false
    const control = this.homeForm.get(campo)

    if (control) {
      control.setValue(this.originalValue) // Restaurar el valor original
      control.disable()
      this.successMessage = 'Edición cancelada'
    } else {
      console.error(`El campo ${campo} no existe en el formulario`)
    }
  }
}

// submit() {
//   if (this.homeForm.valid) {
//     // Recuperar los datos existentes del localStorage
//     const existingData = JSON.parse(localStorage.getItem('loginData') || '[]');

//     // Verificar que haya datos existentes y tomar el primer elemento
//     if (existingData.length > 0) {
//       // Actualiza solo los campos que han sido modificados
//       const updatedData = { ...existingData[0], ...this.homeForm.value };

//       // Guarda los datos modificados en el localStorage
//       localStorage.setItem('loginData', JSON.stringify([updatedData]));
//     }

//     // Deshabilita nuevamente los campos
//     this.homeForm.disable();
//     this.isEditing = false; // Cambiar el estado a no editar
//     this.successMessage = 'Cambios guardados correctamente'; // Mensaje de éxito
//     console.log('Cambios guardados:', this.homeForm.value);
//   }
// }