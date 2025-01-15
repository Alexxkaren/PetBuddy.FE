import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/common/header/header.component';
import { FooterComponent } from './components/common/footer/footer.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockTranslateService = {
    use: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      declarations: [
        AppComponent,
        MockComponents(HeaderComponent, FooterComponent),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ lang: 'en-US' }),
          },
        },
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: TranslateService,
          useValue: mockTranslateService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have as title PetBuddy', () => {
    const app = fixture.componentInstance;
    expect(app.title).toEqual('PetBuddy');
  });

  it('should set language', () => {
    const app = fixture.componentInstance;
    app.ngOnInit();
    expect(mockTranslateService.use).toHaveBeenCalled();
  });
});
