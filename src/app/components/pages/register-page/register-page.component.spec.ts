import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserDataService } from '../../../services/user-data/user-data.service';
import { MetadataService } from '../../../services/metadata.service/metadata.service';
import { RegisterPageComponent } from './register-page.component';

const mockAuthService = {
  user$: of({
    given_name: 'Test',
    family_name: 'Test surname',
    email: 'test@example.com',
    birthdate: '1980-01-01',
  }),
};

const mockRouter = {
  navigate: jest.fn(),
};

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;

  const mockUserDataService = {
    postNewUser: jest.fn().mockReturnValue(of({})),
  };

  const mockMetadataService = {
    getStates: jest.fn().mockReturnValue(of([])),
    getCities: jest.fn().mockReturnValue(of([])),
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
        MatDialogModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserDataService, useValue: mockUserDataService },
        { provide: MetadataService, useValue: mockMetadataService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with user data from AuthService', () => {
    expect(component.firstNameControl?.value).toBe('Test');
    expect(component.lastNameControl?.value).toBe('Test surname');
    expect(component.emailControl?.value).toBe('test@example.com');
  });

  it('should call dateAdapter.setLocale when ngOnInit is called', () => {
    const dateAdapterSpy = jest.spyOn(component['dateAdapter'], 'setLocale');
    component.ngOnInit();
    expect(dateAdapterSpy).toHaveBeenCalledWith('sk-SK');
  });

  it('should call metadataService to fetch states on init', () => {
    component.ngOnInit();
    expect(mockMetadataService.getStates).toHaveBeenCalled();
  });

  it('should disable email control if email is provided by auth', () => {
    expect(component.emailControl?.disabled).toBe(true);
  });
});
