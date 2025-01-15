import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { ErrorPagesComponent } from './error-pages.component';

describe('ErrorPagesComponent', () => {
  let component: ErrorPagesComponent;
  let fixture: ComponentFixture<ErrorPagesComponent>;
  let mockActivatedRoute: unknown;

  beforeEach(async () => {
    mockActivatedRoute = {
      data: of({ ErrorPageType: 'AccessDenied' }),
    };

    await TestBed.configureTestingModule({
      imports: [
        ErrorPagesComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the correct error page type from route data', () => {
    expect(component.errorPageType).toBe('AccessDenied');
  });

  it('should update errorPages with correct data when ErrorPageType is AccessDenied', () => {
    component.ngOnInit();
    expect(component.errorPages.Title).toBe('errorPages.AccessDenied.title');
    expect(component.errorPages.Text).toBe('errorPages.AccessDenied.text');
    expect(component.errorPages.img).toBe('AccessDenied');
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component['subs'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
