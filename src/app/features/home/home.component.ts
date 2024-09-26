import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { usernameExistsValidator, usernameValidator } from 'src/app/shared/validators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  homeForm: FormGroup;
  loginData: any;
  isEditing: { [key: string]: boolean } = {} // Objeto para controlar el estado de edición de cada campo
  successMessage: string | null = null // Mensaje de éxito

  originalValue: { [key: string]: any } = {} // Objeto para almacenar los valores originales de cada campo

  constructor(private fb: FormBuilder) {
    this.homeForm = this.fb.group({
      user: [{ value: '', disabled: true }, [Validators.required, usernameValidator(), usernameExistsValidator()]],
      name: [{ value: '', disabled: true }, Validators.required],
      surname: [{ value: '', disabled: true }, Validators.required],
      pass: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(7)]],
      mail: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
    });

    this.getLoginData();
    this.formPatcher();
  }

  private getLoginData() {
    const data = localStorage.getItem('loginData');
    this.loginData = data ? JSON.parse(data) : null;
  }

  private formPatcher() {
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

  enableEditing(campo: string) {
    this.isEditing[campo] = true; // Activar el modo de edición para el campo específico
    const control = this.homeForm.get(campo)

    if (control) {
      this.originalValue[campo] = control.value // Guardar el valor original
      control.enable() // Habilitar el campo específico
      this.successMessage = null // Limpiar mensaje de éxito
    } else {
      console.error(`El campo ${campo} no existe en el formulario`);
    }
  }

  saveEditing(campo: string) {
    this.isEditing[campo] = false; // Desactivar el modo de edición para el campo específico
    const control = this.homeForm.get(campo)

    if (control) {
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
    this.isEditing[campo] = false 
    const control = this.homeForm.get(campo);

    if (control) {
      control.setValue(this.originalValue[campo])
      control.disable();
      this.successMessage = 'Edición cancelada';
    } else {
      console.error(`El campo ${campo} no existe en el formulario`);
    }
  }
}