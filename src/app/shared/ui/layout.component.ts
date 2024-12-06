import { Component } from "@angular/core";
import { HeaderComponent } from "./header.component";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-layout",
  template: `
    <mat-sidenav-container fullscreen>
      <mat-sidenav #sidenav>
        <mat-nav-list (click)="sidenav.close()">
          <a mat-list-item routerLink="/">
            <mat-icon matListItemIcon>home</mat-icon>
            <span>Home</span>
          </a>

          <a mat-list-item routerLink="todos">
            <mat-icon matListItemIcon>table_chart</mat-icon>
            <span>Todos</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <app-header [sidenav]="sidenav"></app-header>
      <router-outlet></router-outlet>
    </mat-sidenav-container>
  `,
  styles: [`

  `],
  imports: [HeaderComponent, RouterOutlet, MatSidenavModule, MatListModule, RouterLink, MatIconModule],
})
export class LayoutComponent {}