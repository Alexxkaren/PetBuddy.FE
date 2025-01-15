import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatOption } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  PET_VALIDATION,
  ValidationService,
} from '../../../services/validation.service/validation.service';
import { StateDto } from '../../../models/location/state.interface';
import { CityDto } from '../../../models/location/city.interface';
import { MetadataService } from '../../../services/metadata.service/metadata.service';
import { PetService } from '../../../services/pet-data/pet-data.service';
import {
  ImageResponse,
  PetBreedDto,
} from '../../../models/pet/pet-data.interface';
import { PetDataDtoIn } from '../../../models/pet/pet-data.interface';
import { PetGenderTypeDto } from '../../../models/pet/pet-data.interface';
import { PetNatureDto } from '../../../models/pet/pet-data.interface';
import { PetPlacementDto } from '../../../models/pet/pet-data.interface';
import { PetSizeDto } from '../../../models/pet/pet-data.interface';
import { PetTypeDto } from '../../../models/pet/pet-data.interface';
import { ImageService } from '../../../services/images-service/image.service';
import { SpinnerComponent } from '../../common/spinner/spinner.component';

const CITY_TRANSLATION_KEY = 'cities';
const STATE_TRANSLATION_KEY = 'states';
const PET_BREED_TRANSLATION_KEY = 'breeds';
const PET_SIZE_TRANSLATION_KEY = 'sizes';

const NATURE_REMOVED_TRANSLATION_KEY = 'message.nature_deleted';
const MAX_NATURE_TRANSLATION_KEY = 'message.max_nature';
const PET_ADDED_TRANSLATION_KEY = 'message.pet_success';
const PET_NOT_ADDED_TRANSLATION_KEY = 'message.pet_error';
const PHOTOS_ERROR_TRANSLATION_KEY = 'message.photos_error';
const PHOTO_SIZE_TRANSLATION_KEY = 'message.photo_size';
const PHOTO_FORMAT_TRANSLATION_KEY = 'message.photo_format';
const LOAD_ERROR_TRANSLATION_KEY = 'message.load_error';
const FILE_REMOVED = 'message.file_removed';
const CLOSE = 'message.close';

@Component({
  selector: 'app-add-animal-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatOption,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    CdkStepperModule,
    SpinnerComponent,
  ],
  templateUrl: './add-animal-page.component.html',
  styleUrl: './add-animal-page.component.scss',
})
export class AddAnimalPageComponent implements OnInit, OnDestroy {
  firstStepForm = new FormGroup({
    petType: new FormControl<number | null>(null, Validators.required),
  });

  secondStepForm = new FormGroup({
    placement: new FormControl<number | null>(null, Validators.required),
    state: new FormControl<number | null>(null, PET_VALIDATION.state),
    cityId: new FormControl<number | null>(
      { value: null, disabled: true },
      PET_VALIDATION.city,
    ),
    streetAndNumber: new FormControl<string | null>(
      '',
      PET_VALIDATION.streetAndNumber,
    ),
  });

  thirdStepForm = new FormGroup({
    petGenderType: new FormControl<number | null>(null, Validators.required),
  });

  fourthStepForm = new FormGroup({
    petNatures: new FormControl<number[]>([], Validators.required),
  });

  fifthStepForm = new FormGroup({
    petName: new FormControl<string | null>('', PET_VALIDATION.name),
    petAge: new FormControl<number | null>(null, PET_VALIDATION.age),
    petBreed: new FormControl<string | null>('', Validators.required),
    description: new FormControl<string | null>('', PET_VALIDATION.description),
    petSize: new FormControl<string | null>('', Validators.required),
    vaccinated: new FormControl<boolean>(false),
    medicalPapers: new FormControl<boolean>(false),
  });

  stepperOrientation: 'horizontal' | 'vertical' = 'horizontal';
  translatedStates: StateDto[] = [];
  filteredBreeds: PetBreedDto[] = [];
  citySelection: CityDto[] = [];

  selectedPetType: number | null = null;
  selectedGenderType: number | null = null;
  selectedNatures: number[] = [];
  translatedPetSizes: PetSizeDto[] = [];
  petTypes: PetTypeDto[] = [];
  petGenderTypes: PetGenderTypeDto[] = [];
  natures: PetNatureDto[] = [];
  placements: PetPlacementDto[] = [];
  selectedFiles: File[] = [];

  isLoading = false;
  private submitted = false;

  private cities: CityDto[] = [];
  private states: StateDto[] = [];
  private translatedCities: CityDto[] = [];
  private translatedPetBreeds: PetBreedDto[] = [];
  private petSizes: PetSizeDto[] = [];

  private readonly subs = new Subscription();

  constructor(
    private translate: TranslateService,
    private metadataService: MetadataService,
    private snackbar: MatSnackBar,
    private petService: PetService,
    private router: Router,
    private imageService: ImageService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  get addressControl(): AbstractControl | null {
    return this.secondStepForm.get('streetAndNumber');
  }
  get cityControl(): AbstractControl | null {
    return this.secondStepForm.get('cityId');
  }
  get stateControl(): AbstractControl | null {
    return this.secondStepForm.get('state');
  }
  get petNameControl(): AbstractControl | null {
    return this.fifthStepForm.get('petName');
  }
  get petAgeControl(): AbstractControl | null {
    return this.fifthStepForm.get('petAge');
  }
  get petBreedControl(): AbstractControl | null {
    return this.fifthStepForm.get('petBreed');
  }
  get descriptionControl(): AbstractControl | null {
    return this.fifthStepForm.get('description');
  }
  get petSizeControl(): AbstractControl | null {
    return this.fifthStepForm.get('petSize');
  }
  get vaccinatedControl(): AbstractControl | null {
    return this.fifthStepForm.get('vaccinated');
  }
  get medicalPapersControl(): AbstractControl | null {
    return this.fifthStepForm.get('medicalPapers');
  }
  get placementControl(): AbstractControl | null {
    return this.secondStepForm.get('placement');
  }
  get petNaturesControl(): AbstractControl | null {
    return this.fourthStepForm.get('petNatures');
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.setStepperOrientation();
  }

  setTranslatedPetBreeds(breeds: PetBreedDto[]): void {
    this.translatedPetBreeds = breeds;
  }

  ngOnInit(): void {
    this.setStepperOrientation();
    this.loadMetadata();
    this.subs.add(
      this.translate.onLangChange.subscribe(() => {
        this.updateMetadataTranslations();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  isButtonDisabled(): boolean {
    return (
      !this.placementControl?.value ||
      !this.stateControl?.value ||
      !this.cityControl?.value ||
      !this.addressControl?.value
    );
  }

  isInvalid(
    field: AbstractControl | null,
    error: string | null = null,
  ): boolean {
    const isInvalid = field ? field.invalid && field.touched : false;

    if (isInvalid && error) {
      return field?.errors?.[error];
    }

    return isInvalid;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        const validationResult = ValidationService.validateFile(file);

        if (validationResult) {
          if (validationResult['invalidFileSize'] === true) {
            this.openSnackBar(PHOTO_SIZE_TRANSLATION_KEY, CLOSE);
          } else if (validationResult['invalidFileType'] === true) {
            this.openSnackBar(PHOTO_FORMAT_TRANSLATION_KEY, CLOSE);
          }
        } else {
          this.selectedFiles.push(file);
        }
      });
    }
  }

  onStateChange(): void {
    const selectedStateId = this.stateControl?.value;
    if (selectedStateId) {
      this.cityControl?.enable();
      this.citySelection = this.translatedCities.filter(
        (city) => city.stateId === selectedStateId,
      );
    } else {
      this.cityControl?.disable();
    }
  }

  onPetTypeSelect(petTypeId: number): void {
    this.selectedPetType = petTypeId;
    this.firstStepForm.patchValue({ petType: petTypeId });

    this.filteredBreeds = this.translatedPetBreeds.filter(
      (breed) => breed.petTypeId === petTypeId,
    );

    this.fifthStepForm.patchValue({ petBreed: null });
  }

  onGenderTypeSelect(genderTypeId: number): void {
    this.selectedGenderType = genderTypeId;
    this.thirdStepForm.patchValue({ petGenderType: genderTypeId });
  }

  onNatureSelection(natureId: number): void {
    const index = this.selectedNatures.indexOf(natureId);

    if (index !== -1) {
      this.selectedNatures.splice(index, 1);
      this.openSnackBar(NATURE_REMOVED_TRANSLATION_KEY, CLOSE);
    } else if (this.selectedNatures.length < 10) {
      this.selectedNatures.push(natureId);
    } else {
      this.openSnackBar(MAX_NATURE_TRANSLATION_KEY, CLOSE);
    }

    this.petNaturesControl?.setValue(this.selectedNatures);
    this.petNaturesControl?.updateValueAndValidity();
  }

  openSnackBar(messageKey: string, actionKey: string): void {
    const message = this.translate.instant(messageKey);
    const action = this.translate.instant(actionKey);
    this.snackbar.open(message, action, {
      duration: 2000,
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.firstStepForm.valid) {
      this.addNewPet();
    }
  }

  removeFile(fileToRemove: File): void {
    this.selectedFiles = this.selectedFiles.filter(
      (file) => file !== fileToRemove,
    );
    this.openSnackBar(FILE_REMOVED, CLOSE);
  }

  private setStepperOrientation(): void {
    const width = window.innerWidth;
    this.stepperOrientation = width <= 768 ? 'vertical' : 'horizontal';
  }

  private loadMetadata(): void {
    this.isLoading = true;
    this.subs.add(
      forkJoin({
        states: this.metadataService.getStates(),
        cities: this.metadataService.getCities(),
        petTypes: this.metadataService.getPetTypes(),
        petGenderTypes: this.metadataService.getGenders(),
        natures: this.metadataService.getNatures(),
        petSizes: this.metadataService.getPetSizes(),
        petBreeds: this.metadataService.getBreeds(),
        placements: this.metadataService.getPlacements(),
      }).subscribe({
        next: ({
          states,
          cities,
          petTypes,
          petGenderTypes,
          natures,
          petSizes,
          petBreeds,
          placements,
        }) => {
          this.states = states;
          this.cities = cities;
          this.petTypes = petTypes;
          this.petGenderTypes = petGenderTypes;
          this.natures = natures;
          this.petSizes = petSizes;
          this.filteredBreeds = petBreeds;
          this.placements = placements;
          this.updateMetadataTranslations();
          this.isLoading = false;
        },
        error: (err) => {
          this.openSnackBar(LOAD_ERROR_TRANSLATION_KEY, CLOSE);
          this.isLoading = false;
        },
      }),
    );
  }

  private updateMetadataTranslations(): void {
    this.translatedCities = [];
    this.translatedStates = [];
    this.translatedPetBreeds = [];
    this.translatedPetSizes = [];

    this.states.forEach((state) => {
      const translatedState = this.translate.instant(
        `${STATE_TRANSLATION_KEY}.${state.id}`,
      );
      this.translatedStates.push({
        id: state.id,
        name:
          translatedState !== `${STATE_TRANSLATION_KEY}.${state.id}`
            ? translatedState
            : state.name,
      });
    });

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
  }

  private uploadPhotos(photos: File[]): Observable<ImageResponse> {
    const formData = new FormData();
    photos.forEach((photo, index) => {
      formData.append('PhotoFiles', photo, `photo_${index}`);
    });

    return this.imageService.postNewPhotos(photos);
  }

  private addNewPet(): void {
    if (this.selectedFiles?.length) {
      this.isLoading = true;
      this.changeDetectorRef.detectChanges();

      this.subs.add(
        this.uploadPhotos(this.selectedFiles).subscribe({
          next: (imageResponse) => {
            const newPet: PetDataDtoIn = {
              name: this.petNameControl?.value,
              age: parseInt(this.petAgeControl?.value, 10),
              description: this.descriptionControl?.value,
              isVaccinated: this.vaccinatedControl?.value || false,
              hasMedicalPapers: this.medicalPapersControl?.value || false,
              genderId: this.selectedGenderType ?? 0,
              petNaturesIds: this.selectedNatures,
              petSizeId: this.petSizeControl?.value as number,
              breedId: this.petBreedControl?.value as number,
              cityId: this.cityControl?.value as number,
              petPlacementId: this.placementControl?.value as number,
              photosIds: imageResponse.photosIds,
            };

            this.subs.add(
              this.petService.postNewPet(newPet).subscribe({
                next: () => {
                  this.isLoading = true;
                  this.openSnackBar(PET_ADDED_TRANSLATION_KEY, CLOSE);
                  setTimeout(() => {
                    this.router.navigate(['home']);
                  }, 3000);
                },
                error: () => {
                  this.isLoading = false;
                  this.openSnackBar(PET_NOT_ADDED_TRANSLATION_KEY, CLOSE);
                },
              }),
            );
          },
          error: () => {
            this.isLoading = false;
            this.openSnackBar(PHOTOS_ERROR_TRANSLATION_KEY, CLOSE);
          },
        }),
      );
    }
  }
}
