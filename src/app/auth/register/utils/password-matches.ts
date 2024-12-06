import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchesValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const passwordConfirm = control.get('passwordConfirm')?.value;

  return password && passwordConfirm && password === passwordConfirm
    ? null
    : { passwordMatch: true };
};