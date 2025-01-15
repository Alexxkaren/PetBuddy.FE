import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import {
  PetPreviewDataDtoOut,
  PetSearchDataDtoIn,
} from '../../../models/pet/pet-search-data.interface';
import { PetService } from '../../../services/pet-data/pet-data.service';
import { PetProfilePreviewComponent } from '../../common/pet-profile-preview/pet-profile-preview.component';
import {
  PetBreedDto,
  PetGenderTypeDto,
  PetPlacementDto,
  PetSizeDto,
  PetTypeDto,
} from '../../../models/pet/pet-data.interface';
import { MetadataService } from '../../../services/metadata.service/metadata.service';
import { CityDto } from '../../../models/location/city.interface';
import { SearchService } from '../../../services/save-search.service/save-search.service';
import { SpinnerComponent } from '../../common/spinner/spinner.component';

const CITY_TRANSLATION_KEY = 'cities';
const PET_BREED_TRANSLATION_KEY = 'breeds';
const PET_SIZE_TRANSLATION_KEY = 'sizes';
const PET_GENDER_TRANSLATION_KEY = 'genders';
const PET_PLACEMENT_TRANSLATION_KEY = 'placement';
const PET_TYPE_TRANSLATION_KEY = 'types';

const PET_NOT_EXISTS = 'message.no_pets_found';
const LOAD_ERR = 'message.load_error';
const CLOSE = 'message.close';
const SEARCH_PAGE_NOTIFICATION_SENT = 'search_page.notification_sent';
const SEARCH_PAGE_NOTIFICATION_ERROR = 'search_page.notification_error';

@Component({
  selector: 'app-pet-search-page',
  standalone: true,
  imports: [
    PetProfilePreviewComponent,
    MatButton,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    SpinnerComponent,
  ],
  templateUrl: './pet-search-page.component.html',
  styleUrl: './pet-search-page.component.scss',
})
export class PetSearchPageComponent implements OnInit, OnDestroy {
  filterForm = new FormGroup({
    petGenderId: new FormControl<number | null>(null),
    petSizeId: new FormControl<number | null>(null),
    petTypeId: new FormControl<number | null>(null),
    petBreedId: new FormControl<number | null>({ value: null, disabled: true }),
    cityId: new FormControl<number | null>(null),
    petPlacementId: new FormControl<number | null>(null),
  });

  isLoading = false;
  pets: PetPreviewDataDtoOut[] = [];
  displayedPets: PetPreviewDataDtoOut[] = [];
  pageSize = 10;
  currentPage = 0;
  totalPages = 0;

  filteredGenders: PetGenderTypeDto[] = [];
  filteredBreeds: PetBreedDto[] = [];
  filteredSizes: PetSizeDto[] = [];
  filteredPlacements: PetPlacementDto[] = [];
  filteredTypes: PetTypeDto[] = [];
  citySelection: CityDto[] = [];
  petNotExist = false;

  private cities: CityDto[] = [];
  private petTypes: PetTypeDto[] = [];
  private petGenderTypes: PetGenderTypeDto[] = [];
  private petSizes: PetSizeDto[] = [];
  private placements: PetPlacementDto[] = [];
  private translatedCities: CityDto[] = [];
  private translatedPetTypes: PetTypeDto[] = [];
  private translatedPetGenders: PetGenderTypeDto[] = [];
  private translatedPetSizes: PetSizeDto[] = [];
  private translatedPetBreeds: PetBreedDto[] = [];
  private translatedPetPlacement: PetPlacementDto[] = [];
  private readonly subs = new Subscription();

  constructor(
    private petService: PetService,
    private translate: TranslateService,
    private metadataService: MetadataService,
    private snackbar: MatSnackBar,
    private searchService: SearchService,
    private readonly auth: AuthService,
    private router: Router,
  ) {}

  get genderControl(): AbstractControl | null {
    return this.filterForm.get('petGenderId');
  }

  get petSizeControl(): AbstractControl | null {
    return this.filterForm.get('petSizeId');
  }
  get petTypeControl(): AbstractControl | null {
    return this.filterForm.get('petTypeId');
  }
  get petBreedControl(): AbstractControl | null {
    return this.filterForm.get('petBreedId');
  }
  get cityControl(): AbstractControl | null {
    return this.filterForm.get('cityId');
  }
  get petPlacementControl(): AbstractControl | null {
    return this.filterForm.get('petPlacementId');
  }
  get isAuthenticated(): Observable<boolean> {
    return this.auth.isAuthenticated$;
  }

  ngOnInit(): void {
    this.loadMetadata();
    this.applyFilters();
    this.subs.add(
      this.translate.onLangChange.subscribe(() => {
        this.updateMetadataTranslations();
      }),
    );
    this.subs.add(
      this.filterForm.get('petTypeId')?.valueChanges.subscribe(() => {
        this.onPetTypeChange();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  applyFilters(): void {
    this.isLoading = true;
    this.subs.add(
      this.petService
        .getFilteredPetsProfiles({
          genderId: this.filterForm.value.petGenderId,
          petSizeId: this.filterForm.value.petSizeId,
          breedId: this.filterForm.value.petBreedId,
          cityId: this.filterForm.value.cityId,
          petPlacementId: this.filterForm.value.petPlacementId,
          petTypeId: this.filterForm.value.petTypeId,
        })
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.pets = data;
            this.totalPages = Math.ceil(this.pets.length / this.pageSize);
            this.updateDisplayedPets();
            this.petNotExist = !this.checkIfPetsExist();
            if (!this.checkIfPetsExist()) {
              this.openSnackBar(PET_NOT_EXISTS, CLOSE);
            }
          },
          error: () => {
            this.isLoading = false;
            this.openSnackBar(LOAD_ERR, CLOSE);
          },
        }),
    );
  }

  saveSearch(): void {
    this.petNotExist = true;
    const searchData: PetSearchDataDtoIn = {
      genderId: this.filterForm.value.petGenderId ?? null,
      petSizeId: this.filterForm.value.petSizeId ?? null,
      petTypeId: this.filterForm.value.petTypeId ?? null,
      breedId: this.filterForm.value.petBreedId ?? null,
      cityId: this.filterForm.value.cityId ?? null,
      petPlacementId: this.filterForm.value.petPlacementId ?? null,
    };
    this.subs.add(
      this.searchService.saveSearch(searchData).subscribe({
        next: () => {
          this.openSnackBar(SEARCH_PAGE_NOTIFICATION_SENT, CLOSE);
        },
        error: () => {
          this.openSnackBar(SEARCH_PAGE_NOTIFICATION_ERROR, CLOSE);
        },
      }),
    );
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.applyFilters();
  }

  onPetTypeChange(): void {
    const selectedPetTypeId = this.petTypeControl?.value;
    if (selectedPetTypeId) {
      this.petBreedControl?.enable();
      this.filteredBreeds = this.translatedPetBreeds.filter(
        (breed) => breed.petTypeId === selectedPetTypeId,
      );
      this.petBreedControl?.setValue(null);
    } else {
      this.petBreedControl?.disable();
      this.filteredBreeds = [];
    }
  }

  checkIfPetsExist(): boolean {
    return this.pets && this.pets.length > 0;
  }

  openSnackBar(messageKey: string, actionKey: string): void {
    const message = this.translate.instant(messageKey);
    const action = this.translate.instant(actionKey);
    this.snackbar.open(message, action, {
      duration: 2000,
    });
  }

  changePage(newPage: number): void {
    if (newPage < 0 || newPage >= this.totalPages) {
      return;
    }
    this.currentPage = newPage;
    this.updateDisplayedPets();
  }

  updateDisplayedPets(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedPets = this.pets.slice(startIndex, endIndex);
  }

  private loadMetadata(): void {
    this.isLoading = true;
    this.subs.add(
      forkJoin({
        cities: this.metadataService.getCities(),
        petTypes: this.metadataService.getPetTypes(),
        petGenderTypes: this.metadataService.getGenders(),
        petSizes: this.metadataService.getPetSizes(),
        petBreeds: this.metadataService.getBreeds(),
        placements: this.metadataService.getPlacements(),
      }).subscribe({
        next: ({
          cities,
          petTypes,
          petGenderTypes,
          petSizes,
          petBreeds,
          placements,
        }) => {
          this.cities = cities;
          this.petTypes = petTypes;
          this.petGenderTypes = petGenderTypes;
          this.petSizes = petSizes;
          this.filteredBreeds = petBreeds;
          this.placements = placements;
          this.updateMetadataTranslations();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        },
      }),
    );
  }

  private updateMetadataTranslations(): void {
    this.translatedPetGenders = [];
    this.translatedPetSizes = [];
    this.translatedPetBreeds = [];
    this.translatedCities = [];
    this.translatedPetPlacement = [];
    this.translatedPetTypes = [];

    this.cities.forEach((city) => {
      const translatedCity = this.translate.instant(
        `${CITY_TRANSLATION_KEY}.${city.id}`,
      );
      this.translatedCities.push({
        id: city.id,
        name:
          translatedCity !== `${CITY_TRANSLATION_KEY}.${city.id}`
            ? translatedCity
            : city.name,
        stateId: city.stateId,
      });
    });

    this.filteredBreeds.forEach((breed) => {
      const translatedBreed = this.translate.instant(
        `${PET_BREED_TRANSLATION_KEY}.${breed.id}`,
      );
      this.translatedPetBreeds.push({
        id: breed.id,
        name:
          translatedBreed !== `${PET_BREED_TRANSLATION_KEY}.${breed.id}`
            ? translatedBreed
            : breed.name,
        petTypeId: breed.petTypeId,
      });
    });

    this.petSizes.forEach((size) => {
      const translatedSize = this.translate.instant(
        `${PET_SIZE_TRANSLATION_KEY}.${size.id}`,
      );
      this.translatedPetSizes.push({
        id: size.id,
        name:
          translatedSize !== `${PET_SIZE_TRANSLATION_KEY}.${size.id}`
            ? translatedSize
            : size.name,
      });
    });

    this.petGenderTypes.forEach((gender) => {
      const translatedGender = this.translate.instant(
        `${PET_GENDER_TRANSLATION_KEY}.${gender.id}`,
      );
      this.translatedPetGenders.push({
        id: gender.id,
        name:
          translatedGender !== `${PET_GENDER_TRANSLATION_KEY}.${gender.id}`
            ? translatedGender
            : gender.name,
      });
    });

    this.placements.forEach((placement) => {
      const translatedPlacement = this.translate.instant(
        `${PET_PLACEMENT_TRANSLATION_KEY}.${placement.id}`,
      );
      this.translatedPetPlacement.push({
        id: placement.id,
        name:
          translatedPlacement !==
          `${PET_PLACEMENT_TRANSLATION_KEY}.${placement.id}`
            ? translatedPlacement
            : placement.name,
      });
    });

    this.petTypes.forEach((type) => {
      const translatedType = this.translate.instant(
        `${PET_TYPE_TRANSLATION_KEY}.${type.id}`,
      );
      this.translatedPetTypes.push({
        id: type.id,
        name:
          translatedType !== `${PET_TYPE_TRANSLATION_KEY}.${type.id}`
            ? translatedType
            : type.name,
      });
    });
    this.filteredGenders = this.translatedPetGenders;
    this.filteredSizes = this.translatedPetSizes;
    this.filteredTypes = this.translatedPetTypes;
    this.filteredPlacements = this.translatedPetPlacement;
    this.citySelection = this.translatedCities;
  }
}
