import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { UserDataService } from '../../../services/user-data/user-data.service';
import { MetadataService } from '../../../services/metadata.service/metadata.service';
import { ProfilePageComponent } from './profile-page.component';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;

  const mockUserDataService = {
    getUserData: jest.fn().mockReturnValue(of({})),
    updateUserData: jest.fn().mockReturnValue(of({})),
    getCities: jest.fn().mockReturnValue(of([])),
  };

  const mockMetadataService = {
    getStates: jest.fn().mockReturnValue(of([])),
    getCities: jest.fn().mockReturnValue(of([])),
  };

  mockUserDataService.getUserData.mockReturnValue(
    of({
      FirstName: 'Name',
      LastName: 'Last Name',
      DateOfBirth: new Date(),
      StreetAndNumber: 'Street 123',
      Email: 'test@example.com',
      PhoneNumber: '123456789',
      CityId: 1,
    }),
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfilePageComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        { provide: UserDataService, useValue: mockUserDataService },
        { provide: MetadataService, useValue: mockMetadataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUserData on init', () => {
    expect(mockUserDataService.getUserData).toHaveBeenCalled();
  });

  it('should return user data', () => {
    const userData = {
      firstName: 'Name test',
      lastName: 'Last name test',
      email: 'test@example.com',
      dateOfBirth: new Date(),
    };
    mockUserDataService.getUserData.mockReturnValue(of(userData));
    component.ngOnInit();
    expect(component.userData).toEqual(userData);
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component['subs'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should return true if field is invalid and submitted', () => {
    component.regForm.controls['firstName'].setErrors({ invalid: true });
    const field: AbstractControl = component.regForm.get(
      'firstName',
    ) as AbstractControl;
    component.submitted = true;
    expect(field.valid).toBe(false);
    expect(component.isInvalid(field)).toBe(true);
  });

  it('should return false if field is invalid and not submitted', () => {
    component.regForm.controls['firstName'].setErrors({ invalid: true });
    const field: AbstractControl = component.regForm.get(
      'firstName',
    ) as AbstractControl;
    component.submitted = false;
    expect(component.isInvalid(field)).toBe(false);
  });

  it('should return false if field is null', () => {
    const field = null;
    component.submitted = true;
    expect(component.isInvalid(field)).toBe(false);
  });

  it('should return false if field is valid', () => {
    component.regForm.controls['firstName'].setErrors(null);
    const field: AbstractControl = component.regForm.get(
      'firstName',
    ) as AbstractControl;
    component.submitted = true;
    expect(component.isInvalid(field)).toBe(false);
  });

  it('should call setFormData on openDialogTemplateContactInfo', () => {
    const setFormDataSpy = jest.spyOn(component, 'setFormData');
    component.openDialogTemplateContactInfo();
    expect(setFormDataSpy).toHaveBeenCalled();
  });

  it('should call setFormData on openDialogTemplateBasicInfo', () => {
    const setFormDataSpy = jest.spyOn(component, 'setFormData');
    component.openDialogTemplateBasicInfo();
    expect(setFormDataSpy).toHaveBeenCalled();
  });

  it('should call setFormData on onCancelForm', () => {
    const setFormDataSpy = jest.spyOn(component, 'setFormData');
    component.onCancelForm();
    expect(setFormDataSpy).toHaveBeenCalled();
  });

  it('should get addressControl', () => {
    const addressControl = component.addressControl;
    expect(addressControl).toBeTruthy();
    expect(addressControl?.value).toBe('');
  });

  it('should get phoneNumberControl', () => {
    const phoneNumberControl = component.phoneNumberControl;
    expect(phoneNumberControl).toBeTruthy();
    expect(phoneNumberControl?.value).toBe('');
  });

  it('should get cityIdControl', () => {
    const cityIdControl = component.cityIdControl;
    expect(cityIdControl).toBeTruthy();
    expect(cityIdControl?.value).toBe(null);
  });

  it('should patch set loading to false on error', () => {
    const error = new Error('error');
    mockUserDataService.updateUserData.mockReturnValue(throwError(error));
    component.submit();
    expect(component.isLoading).toBe(false);
  });
});
