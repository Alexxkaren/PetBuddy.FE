import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './components/common/header/header.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { supportedLanguages } from './models/infra/supported-languages.enum';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'PetBuddy';

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['lang']) {
        const lang = params['lang'];
        if (this.isLanguageSupported(lang)) {
          this.translateService.use(lang);
        }

        // Remove lang query param from URL
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { lang: null },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  private isLanguageSupported(lang: string): boolean {
    return supportedLanguages.some((l) => l.Code === lang);
  }
}
