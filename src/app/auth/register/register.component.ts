import { Component, effect, inject } from '@angular/core';
import { RegisterFormComponent } from './ui/register-form.component';
import { MatCardModule } from '@angular/material/card';
import { RegisterService } from './data-access/register.service';
import { AuthService } from '../../shared/data-access/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RegisterFormComponent, MatCardModule],
  providers: [RegisterService],
  template: `
    <section>
      <mat-card>
        <app-register-form
          [loading]="registerService.loading()"
          (register)="registerService.register$.next($event)"
        />
      </mat-card>
    </section>
  `,
  styles: [
    `
      mat-card {
        width: 500px;
        margin: 20px 10px;
        padding: 20px 0;
      }

      section {
        display: flex;
        justify-content: center;
      }
    `
  ]
})
export default class RegisterComponent {
  registerService = inject(RegisterService);
  authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    effect(() => {
      if (this.authService.currentUser()) {
        this.router.navigate(['home']);
      }

      if (this.registerService.error()) {
        this.snackBar.open(this.registerService.error() as string, 'Close');
      }
    });
  }
}