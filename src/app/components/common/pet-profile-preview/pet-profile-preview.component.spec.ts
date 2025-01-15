import { of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MetadataService } from '../../../services/metadata.service/metadata.service';
import { PetProfilePreviewComponent } from './pet-profile-preview.component';

describe('PetProfilePreviewComponent', () => {
  let component: PetProfilePreviewComponent;
  let metadataServiceMock: jest.Mocked<MetadataService>;
  let translateServiceMock: jest.Mocked<TranslateService>;
  let onLangChangeSubject: Subject<void>;
  let routerMock: jest.Mocked<Router>;
  let dialogMock: jest.Mocked<MatDialog>;
  let activatedRouteMock: jest.Mocked<ActivatedRoute>;

  beforeEach(() => {
    metadataServiceMock = {
      getCities: jest.fn(),
      getGenders: jest.fn(),
    } as unknown as jest.Mocked<MetadataService>;

    metadataServiceMock.getCities.mockReturnValue(
      of([{ id: 1, name: 'Bratislava', stateId: 1 }]),
    );

    onLangChangeSubject = new Subject<void>();

    translateServiceMock = {
      instant: jest.fn().mockImplementation((key) => `translated ${key}`),
      onLangChange: onLangChangeSubject.asObservable(),
    } as unknown as jest.Mocked<TranslateService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    dialogMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    activatedRouteMock = {
      snapshot: {
        params: {},
      },
      queryParams: of({ id: '123' }),
    } as unknown as jest.Mocked<ActivatedRoute>;

    component = new PetProfilePreviewComponent(
      metadataServiceMock,
      translateServiceMock,
      routerMock,
      dialogMock,
      activatedRouteMock,
    );
    component.ngOnInit();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly fetch city name', () => {
    const cityName = component.getCityName(1);
    expect(cityName).toBe('translated cities.1');
  });

  it('should return "Unknown" for nonexistent cityId', () => {
    const cityName = component.getCityName(999);
    expect(cityName).toBe('Unknown');
  });

  it('should update city translations on language change', () => {
    onLangChangeSubject.next();

    const cityName = component.getCityName(1);
    expect(cityName).toBe('translated cities.1');
    expect(translateServiceMock.instant).toHaveBeenCalledWith('cities.1');
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component['subs'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should correctly fetch gender icon for male', () => {
    const genderIcon = component.getGenderIcon(1);
    expect(genderIcon).toBe('male_icon.svg');
  });

  it('should correctly fetch gender icon for female', () => {
    const genderIcon = component.getGenderIcon(2);
    expect(genderIcon).toBe('female_icon.svg');
  });

  it('should correctly fetch gender icon for hermaphrodite', () => {
    const genderIcon = component.getGenderIcon(3);
    expect(genderIcon).toBe('hermaphrodite_icon.svg');
  });

  it('should return "unknown_icon" for unknown genderId', () => {
    const genderIcon = component.getGenderIcon(4);
    expect(genderIcon).toBe('unknown_icon.svg');
  });

  it('should close dialog on dialog close button click', () => {
    component.openDeleteDialog();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog on button click', () => {
    component.openDeleteDialog();
    expect(dialogMock.open).toHaveBeenCalled();
  });
});
