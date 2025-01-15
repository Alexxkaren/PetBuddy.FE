import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { filter, Observable, Subscription, switchMap } from 'rxjs';
import { LanguageDto } from '../../../models/infra/language.interface';
import { supportedLanguages } from '../../../models/infra/supported-languages.enum';
import { UserDataService } from '../../../services/user-data/user-data.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    TranslateModule,
    MatGridListModule,
    MatButtonModule,
    MatRadioModule,
    MatButtonToggleModule,
    FormsModule,
    MatMenuModule,
    MatMenuTrigger,
    MatIconModule,
    NgOptimizedImage,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  selectedLanguage: LanguageDto[] = supportedLanguages;
  supportedLanguages = supportedLanguages;
  selectedLang: string;

  private isAuthenticated$;
  private user$;

  private readonly subs = new Subscription();

  constructor(
    private readonly auth: AuthService,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly userDataService: UserDataService,
  ) {
    this.isAuthenticated$ = this.auth.isAuthenticated$;
    this.user$ = this.auth.user$;
    this.selectedLang = this.translateService.currentLang;

    this.subs.add(
      this.translateService.onLangChange.subscribe((event) => {
        this.selectedLang = event.lang;
      }),
    );
  }

  get isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  get user(): unknown {
    return this.user$;
  }

  ngOnInit(): void {
    this.subs.add(
      this.isAuthenticated$
        .pipe(
          filter((isAuthenticated) => !!isAuthenticated),
          switchMap(() => this.userDataService.checkIfUserIsRegistered()),
        )
        .subscribe((isRegistered: boolean) => {
          if (isRegistered) {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/register']);
          }
        }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setLanguage(language: string): void {
    this.translateService.use(language);
  }

  navigateTo(page: string): void {
    this.router.navigate([page]);
  }

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({
      logoutParams: { returnTo: window.location.origin },
    });
  }
}
