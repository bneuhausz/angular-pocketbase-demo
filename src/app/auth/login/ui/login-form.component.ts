import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Credentials } from '../../../shared/interfaces/credentials';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="login.emit(loginForm.getRawValue())" #form="ngForm">
      <mat-form-field>
        <input matInput formControlName="username" placeholder="Username" />
      </mat-form-field>
      <mat-form-field>
        <input matInput type="password" formControlName="password" placeholder="Password" />
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
          Login
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
export class LoginFormComponent {
  login = output<Credentials>();
  loading = input.required<boolean>();

  private readonly fb = inject(FormBuilder);

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
}