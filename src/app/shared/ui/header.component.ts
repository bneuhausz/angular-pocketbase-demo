import { Component, inject, input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../data-access/auth.service';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, RouterLink, MatProgressSpinnerModule, MatIconModule],
  template: `
    <mat-toolbar id="app-header">
      <button mat-icon-button (click)="sidenav().open()">
        <mat-icon>menu</mat-icon>
      </button>
      <a class="app-link" routerLink="/">LearNg</a>
      <span class="spacer"></span>
      @if (authService.currentUser(); as user) {
        <span id="username-container">{{ user['username'] }}</span>
        <button mat-raised-button (click)="authService.logout$.next()">
          Logout
        </button>
      }
      @else {
        <a mat-raised-button routerLink="auth/login">Login</a>
      }
    </mat-toolbar>
  `,
  styles: [
    `
      #app-header {
        background-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
      }

      mat-icon {
        margin-left: -20px;
        color: var(--mat-sys-on-primary);
      }

      .app-link {
        text-decoration: none;
        color: inherit;
        cursor: pointer;
      }

      #username-container {
        margin-right: 1rem;
      }

      .spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class HeaderComponent {
  authService = inject(AuthService);
  sidenav = input.required<MatSidenav>();
}
