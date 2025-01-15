import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MatDialog } from '@angular/material/dialog';
import { PetService } from '../../../services/pet-data/pet-data.service';
import { MetadataService } from '../../../services/metadata.service/metadata.service';
import { PetDataDto } from '../../../models/pet/pet-data.interface';
import { PetOverviewPageComponent } from './pet-overview-page.component';

describe('PetOverviewPageComponent', () => {
  let component: PetOverviewPageComponent;
  let fixture: ComponentFixture<PetOverviewPageComponent>;
  let petServiceMock: jest.Mocked<PetService>;
  let metadataServiceMock: jest.Mocked<MetadataService>;
  let routerMock: jest.Mocked<ActivatedRoute>;
  const authServiceMock: Partial<AuthService> = {};
  let dialogMock: jest.Mocked<MatDialog>;

  beforeEach(async () => {
    dialogMock = {
      open: jest.fn(),
      closeAll: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;
    petServiceMock = {
      getFilteredPetsProfiles: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<PetService>;

    metadataServiceMock = {
      getCities: jest
        .fn()
        .mockReturnValue(of([{ id: 1, name: 'City1', stateId: 1 }])),
      getPetTypes: jest.fn().mockReturnValue(of([{ id: 1, name: 'Type1' }])),
      getGenders: jest.fn().mockReturnValue(of([{ id: 1, name: 'Male' }])),
      getPetSizes: jest.fn().mockReturnValue(of([{ id: 1, name: 'Small' }])),
      getBreeds: jest
        .fn()
        .mockReturnValue(of([{ id: 1, name: 'Breed1', petTypeId: 1 }])),
      getPlacements: jest
        .fn()
        .mockReturnValue(of([{ id: 1, name: 'Placement1' }])),
      getNatures: jest.fn().mockReturnValue(of([{ id: 1, name: 'Nature1' }])),
    } as unknown as jest.Mocked<MetadataService>;

    routerMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1234'),
        },
      },
      queryParams: of({ id: '5678' }),
    } as unknown as jest.Mocked<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [
        PetOverviewPageComponent,
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: PetService, useValue: petServiceMock },
        { provide: MetadataService, useValue: metadataServiceMock },
        { provide: ActivatedRoute, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call metadataService and load metadata', () => {
    component['loadMetadata']();

    expect(metadataServiceMock.getGenders).toHaveBeenCalled();
    expect(metadataServiceMock.getPetSizes).toHaveBeenCalled();
    expect(metadataServiceMock.getBreeds).toHaveBeenCalled();
    expect(metadataServiceMock.getNatures).toHaveBeenCalled();
    expect(metadataServiceMock.getPlacements).toHaveBeenCalled();
    expect(metadataServiceMock.getCities).toHaveBeenCalled();
  });

  it('should return empty string for non-existing gender', () => {
    const gender = component.getTranslatedGender(99);
    expect(gender).toBe('');
  });

  it('should return the translated breed name', () => {
    const breedId = 1;
    component['translatedPetBreed'] = [
      {
        id: 1,
        name: 'TranslatedBreed1',
        petTypeId: 0,
      },
    ];

    const breed = component.getTranslatedBreed(breedId);

    expect(breed).toBe('TranslatedBreed1');
  });

  it('should return the translated size name', () => {
    const sizeId = 1;
    component['translatedPetSizes'] = [{ id: 1, name: 'Small' }];

    const size = component.getTranslatedSize(sizeId);

    expect(size).toBe('Small');
  });

  it('should return the translated city name', () => {
    const cityId = 1;
    component['translatedCities'] = [{ id: 1, name: 'City1', stateId: 1 }];

    const city = component.getTranslatedCity(cityId);

    expect(city).toBe('City1');
  });

  it('should return the translated placement name', () => {
    const placementId = 1;
    component['translatedPlacements'] = [{ id: 1, name: 'Placement1' }];

    const placement = component.getTranslatedPlacement(placementId);

    expect(placement).toBe('Placement1');
  });

  it('should return the translated natures', () => {
    component['translatedNatures'] = [{ id: 1, name: 'Nature1' }];

    const natures = component.getTranslatedNatures([1]);

    expect(natures).toBe('Nature1');
  });

  it('should go to previous image on prevImage call', () => {
    component.petData = {
      petImages: ['img1', 'img2', 'img3'],
    } as PetDataDto;
    component.currentImageIndex = 0;
    component.prevImage();
    expect(component.currentImageIndex).toBe(2);
  });

  it('should go to next image on nextImage call', () => {
    component.petData = {
      petImages: ['img1', 'img2', 'img3'],
    } as PetDataDto;
    component.currentImageIndex = 0;
    component.nextImage();
    expect(component.currentImageIndex).toBe(1);
  });

  it('should close all dialogs on onCancel call', () => {
    component.onCancel();
    expect(dialogMock.closeAll).toHaveBeenCalled();
  });
});
