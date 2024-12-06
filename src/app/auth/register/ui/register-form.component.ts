import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchesValidator } from '../utils/password-matches';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateCredentials } from '../../../shared/interfaces/credentials';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="register.emit(registerForm.getRawValue())" #form="ngForm">
      <mat-form-field>
        <input matInput formControlName="username" placeholder="Username" />
      </mat-form-field>
      <mat-form-field>
        <input matInput formControlName="email" placeholder="Email" />
      </mat-form-field>
      <mat-form-field>
        <input matInput type="password" formControlName="password" placeholder="Password" />
      </mat-form-field>
      <mat-form-field>
        <input matInput type="password" formControlName="passwordConfirm" placeholder="Confirm password" />
      </mat-form-field>
      <button 
        mat-raised-button
        class="primary-button"
        type="submit"
        [disabled]="loading() || form.invalid"
        [class.disabled-button]="loading() || form.invalid"
      >
        @if (loading()) {
          <mat-spinner diameter="30"></mat-spinner>
        }
        @else {
          Register
        }
      </button>
    </form>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      mat-form-field {
        width: 90%;
      }

      .primary-button {
        background-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
        width: 30%;
      }

      .disabled-button {
        background-color: var(--mat-sys-outline-variant);
      }
    `,
  ],
})
export class RegisterFormComponent {
  register = output<CreateCredentials>();
  loading = input.required<boolean>();

  private readonly fb = inject(FormBuilder);

  registerForm = this.fb.nonNullable.group(
    {
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    },
    {
      validators: passwordMatchesValidator,
    }
  );
}