import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value
    if (!value) { 
      return null
    }

    const hasNumber = /\d/.test(value)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
    const valid = hasNumber && hasSpecialChar
    return !valid ? { specialCharNumber: true } : null
  }
}


function getExistingUsers(): any[] {
  return JSON.parse(localStorage.getItem('registerData') || '[]')
}

export function usernameExistsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const existingUsers = getExistingUsers()
    const username = control.value?.toLowerCase()
    const userExists = existingUsers.some((user: any) => user.user.toLowerCase() === username)
    return userExists ? { usernameExists: true } : null
  }
}