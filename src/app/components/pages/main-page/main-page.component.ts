import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: 'main-page.component.html',
  styleUrls: ['main-page.component.scss'],
})
export class MainPageComponent {
  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  get isAuthenticated(): Observable<boolean> {
    return this.auth.isAuthenticated$;
  }

  navigateTo(page: string): void {
    this.router.navigate([page]);
  }
}
