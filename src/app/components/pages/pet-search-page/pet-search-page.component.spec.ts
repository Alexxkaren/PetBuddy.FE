import { of, throwError } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { PetService } from '../../../services/pet-data/pet-data.service';
import { MetadataService } from '../../../services/metadata.service/metadata.service';
import { PetSearchPageComponent } from './pet-search-page.component';

describe('PetSearchPageComponent', () => {
  let component: PetSearchPageComponent;
  let fixture: ComponentFixture<PetSearchPageComponent>;
  let petServiceMock: jest.Mocked<PetService>;
  let snackbarMock: jest.Mocked<MatSnackBar>;
  let metadataServiceMock: jest.Mocked<MetadataService>;
  const authServiceMock: Partial<AuthService> = {};

  beforeEach(async () => {
    petServiceMock = {
      getFilteredPetsProfiles: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<PetService>;

    snackbarMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBar>;

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
    } as unknown as jest.Mocked<MetadataService>;

    await TestBed.configureTestingModule({
      imports: [
        PetSearchPageComponent,
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
        { provide: PetService, useValue: petServiceMock },
        { provide: MatSnackBar, useValue: snackbarMock },
        { provide: MetadataService, useValue: metadataServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call petService.getFilteredPetsProfiles on ngOnInit', () => {
    component.ngOnInit();
    expect(petServiceMock.getFilteredPetsProfiles).toHaveBeenCalled();
  });

  it('should call petService.getFilteredPetsProfiles on applyfilters', () => {
    component.applyFilters();
    expect(petServiceMock.getFilteredPetsProfiles).toHaveBeenCalled();
  });

  it('should call snackbar.open on applyfilters', () => {
    component.applyFilters();
    expect(snackbarMock.open).toHaveBeenCalled();
  });

  it('should call petService.getFilteredPetsProfiles on clearFilters', () => {
    component.resetFilters();
    expect(petServiceMock.getFilteredPetsProfiles).toHaveBeenCalled();
  });

  it('should disable petBreedControl and clear filteredBreeds when no petTypeId is selected', () => {
    component.petTypeControl?.setValue(null);
    component.onPetTypeChange();
    const petBreedControl = component.petBreedControl;

    expect(petBreedControl?.disabled).toBeTruthy();
    expect(component.filteredBreeds).toEqual([]);
  });

  it('should enable petBreedControl and set filteredBreeds when petTypeId is selected', () => {
    component.petTypeControl?.setValue({ id: 1, name: 'Dog' });
    component.onPetTypeChange();
    const petBreedControl = component.petBreedControl;

    expect(petBreedControl?.disabled).toBeFalsy();
    expect(component.filteredBreeds).toEqual([]);
  });

  it('should not change page if newPage is out of range', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    component.changePage(-1);
    expect(component.currentPage).toBe(1);

    component.changePage(3);
    expect(component.currentPage).toBe(1);
  });

  it('should update currentPage and call updateDisplayedPets when newPage is valid', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    jest.spyOn(component, 'updateDisplayedPets');

    component.changePage(2);
    expect(component.currentPage).toBe(2);
    expect(component.updateDisplayedPets).toHaveBeenCalled();
  });

  it('should enable petBreedControl and set filteredBreeds based on selectedPetTypeId', () => {
    component['translatedPetBreeds'] = [
      { id: 1, name: 'Breed1', petTypeId: 10 },
      { id: 2, name: 'Breed2', petTypeId: 20 },
    ];
    component.petTypeControl?.setValue(10);
    component.onPetTypeChange();
    const petBreedControl = component.petBreedControl;

    expect(petBreedControl?.enabled).toBeTruthy();
    expect(petBreedControl?.value).toBeNull();
    expect(component.filteredBreeds).toEqual([
      { id: 1, name: 'Breed1', petTypeId: 10 },
    ]);
  });

  it('should load metadata successfully', () => {
    component['loadMetadata']();
    expect(metadataServiceMock.getCities).toHaveBeenCalled();
    expect(metadataServiceMock.getPetTypes).toHaveBeenCalled();
    expect(metadataServiceMock.getGenders).toHaveBeenCalled();
    expect(metadataServiceMock.getPetSizes).toHaveBeenCalled();
    expect(metadataServiceMock.getBreeds).toHaveBeenCalled();
    expect(metadataServiceMock.getPlacements).toHaveBeenCalled();

    expect(component['isLoading']).toBeFalsy();
    expect(component['cities']).toEqual([{ id: 1, name: 'City1', stateId: 1 }]);
    expect(component['petTypes']).toEqual([{ id: 1, name: 'Type1' }]);
  });

  it('should handle errors during loadMetadata', () => {
    metadataServiceMock.getCities.mockReturnValue(
      throwError(() => new Error('Error')),
    );
    component['loadMetadata']();
    expect(component['isLoading']).toBeFalsy();
  });

  it('should translate cities correctly', () => {
    const translateInstMock = jest
      .spyOn(component['translate'], 'instant')
      .mockImplementation((key) => {
        if (key === 'cities.1') {
          return 'City1 Translated';
        }
        return key;
      });

    component['cities'] = [{ id: 1, name: 'City1', stateId: 1 }];
    component['updateMetadataTranslations']();

    expect(translateInstMock).toHaveBeenCalledWith('cities.1');
    expect(component['translatedCities']).toEqual([
      { id: 1, name: 'City1 Translated', stateId: 1 },
    ]);
  });
});
