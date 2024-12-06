import { Component, effect, inject } from '@angular/core';;
import { LoginFormComponent } from "./ui/login-form.component";
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../shared/data-access/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [LoginFormComponent, MatCardModule, RouterModule],
  template: `
    <section>
      <mat-card>
        <app-login-form
          [loading]="authService.loading()"
          (login)="authService.login$.next($event)"
        />
        <span><a routerLink="/auth/register">Register account</a></span>
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

      span {
        padding-top: 15px;
        display: flex;
        justify-content: center;
      }

      a {
        text-decoration: none;
        cursor: pointer;
      }

      section {
        display: flex;
        justify-content: center;
      }
    `
  ],
})
export default class LoginComponent {
  authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    effect(() => {
      if (this.authService.currentUser()) {
        this.router.navigate(['home']);
      }

      if (this.authService.error()) {
        this.snackBar.open(this.authService.error() as string, 'Close');
      }
    });
  }
}