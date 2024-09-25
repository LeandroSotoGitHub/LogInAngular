import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPassDirective]'
})
export class PassDirectiveDirective {
  @Output() strengthChanged: EventEmitter<number> = new EventEmitter<number>()  // Emitimos la fuerza al componente

  constructor(private el: ElementRef, private control: NgControl) {}

  // Escucha el evento de entrada del input (cada vez que el usuario escribe)
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const password = (event.target as HTMLInputElement).value  // Valor actual del campo de contraseña
    const strength = this.calculatePasswordStrength(password) // Calcula la fortaleza
    this.strengthChanged.emit(strength);  // Emitir el valor de la fortaleza al componente

  }

  // Método que calcula la fortaleza de la contraseña según varias reglas
  private calculatePasswordStrength(password: string): number {
    let strength = 0
    
    const hasLowerCase = /[a-z]/.test(password)  // Verifica si tiene letras minúsculas
    const hasUpperCase = /[A-Z]/.test(password)  // Verifica si tiene letras mayúsculas
    const hasNumbers = /\d/.test(password)       // Verifica si tiene números
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password)  // Verifica si tiene caracteres especiales
    const lengthValid = password.length >= 8     // Verifica si tiene al menos 8 caracteres

    // Suma puntos por cada regla cumplida
    if (hasLowerCase) strength += 1
    if (hasUpperCase) strength += 1
    if (hasNumbers) strength += 1
    if (hasSpecialChars) strength += 1
    if (lengthValid) strength += 1

    return strength  // Retorna un valor entre 0 y 5
  }

}
