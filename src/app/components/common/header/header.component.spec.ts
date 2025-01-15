import { TestBed, ComponentFixture } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { Router, NavigationEnd } from '@angular/router';
import { UserDataService } from '../../../services/user-data/user-data.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: Partial<AuthService>;
  let routerMock: Partial<Router>;
  let userDataServiceMock: Partial<UserDataService>;

  beforeEach(async () => {
    authServiceMock = {
      isAuthenticated$: of(true),
      user$: of({ email: 'test@gmail.com', sub: 'auth0|123' }),
      loginWithRedirect: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
      events: of(new NavigationEnd(1, '/home', '/home')),
    };

    userDataServiceMock = {
      checkIfUserIsRegistered: jest.fn(() => of(true)),
    };

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: UserDataService, useValue: userDataServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the given page on navigateTo()', () => {
    component.navigateTo('/about');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/about']);
  });

  it('should call loginWithRedirect on login()', () => {
    component.login();
    expect(authServiceMock.loginWithRedirect).toHaveBeenCalled();
  });
});
