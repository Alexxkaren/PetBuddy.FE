import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-pages',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './error-pages.component.html',
  styleUrl: './error-pages.component.scss',
})
export class ErrorPagesComponent implements OnInit, OnDestroy {
  errorPageType: ErrorPageType = 'ErrorNotFound';
  errorPages = { Title: '', Text: '', img: '' };
  private readonly subs = new Subscription();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.subs.add(
      this.route.data.subscribe((data) => {
        this.errorPageType =
          (data['ErrorPageType'] as ErrorPageType) || 'ErrorNotFound';
        this.updateErrorPage();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private updateErrorPage(): void {
    this.errorPages = {
      Title: `errorPages.${this.errorPageType}.title`,
      Text: `errorPages.${this.errorPageType}.text`,
      img: this.errorPageType,
    };
  }
}

export type ErrorPageType = 'AccessDenied' | 'ErrorNotFound';
