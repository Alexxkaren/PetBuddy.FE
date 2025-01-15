import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';
import { PetService } from '../../../services/pet-data/pet-data.service';
import {
  PetBreedDto,
  PetDataDto,
  PetGenderTypeDto,
  PetNatureDto,
  PetPlacementDto,
  PetSizeDto,
} from '../../../models/pet/pet-data.interface';
import { MetadataService } from '../../../services/metadata.service/metadata.service';
import { CityDto } from '../../../models/location/city.interface';
import { SpinnerComponent } from '../../common/spinner/spinner.component';
import { UserDataService } from '../../../services/user-data/user-data.service';

const PET_BREED_TRANSLATION_KEY = 'breeds';
const PET_SIZE_TRANSLATION_KEY = 'sizes';
const PET_GENDER_TRANSLATION_KEY = 'genders';
const PET_NATURE_TRANSLATION_KEY = 'natures';
const PET_PLACEMENT_TRANSLATION_KEY = 'placement';
const CITY_TRANSLATION_KEY = 'cities';

const LOAD_ERR = 'message.load_error';
const CLOSE = 'message.close';
const NO_PET_ID = 'message.no_pet_id';

@Component({
  selector: 'app-pet-overview-page',
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    TranslateModule,
    CommonModule,
    SpinnerComponent,
    MatCardModule,
  ],
  templateUrl: './pet-overview-page.component.html',
  styleUrl: './pet-overview-page.component.scss',
})
export class PetOverviewPageComponent implements OnInit, OnDestroy {
  @ViewChild('dialogTemplatUserContactInfo', { static: true })
  dialogTemplatUserContactInfo!: TemplateRef<unknown>;

  petData!: PetDataDto;
  currentImageIndex = 0;
  isLoading = false;

  userFirstName = '';
  userLastName = '';
  userPhoneNumber = '';

  private translatedPetSizes: PetSizeDto[] = [];
  private translatedPetBreed: PetBreedDto[] = [];
  private translatedPetGender: string[] = [];
  private translatedNatures: PetNatureDto[] = [];
  private translatedPlacements: PetPlacementDto[] = [];
  private translatedCities: CityDto[] = [];

  private petGenderTypes: PetGenderTypeDto[] = [];
  private petSizes: PetSizeDto[] = [];
  private petBreeds: PetBreedDto[] = [];
  private natures: PetNatureDto[] = [];
  private placements: PetPlacementDto[] = [];
  private cities: CityDto[] = [];

  private readonly subs = new Subscription();

  constructor(
    private petService: PetService,
    private translate: TranslateService,
    private metadataService: MetadataService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private userDataService: UserDataService,
    private readonly auth: AuthService,
  ) {}

  get isAuthenticated(): Observable<boolean> {
    return this.auth.isAuthenticated$;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadMetadata();
    this.route.queryParams.subscribe((params) => {
      const petId = params['id'];
      if (petId && Guid.isGuid(petId)) {
        this.subs.add(
          this.petService.getPetById(Guid.parse(petId)).subscribe({
            next: (petData) => {
              this.petData = petData;
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
              this.openSnackBar(LOAD_ERR, CLOSE);
            },
          }),
        );
      } else {
        this.isLoading = false;
        this.openSnackBar(NO_PET_ID, CLOSE);
      }
    });

    this.subs.add(
      this.translate.onLangChange.subscribe(() => {
        this.updateMetadataTranslations();
      }),
    );
  }

  openSnackBar(messageKey: string, actionKey: string): void {
    const message = this.translate.instant(messageKey);
    const action = this.translate.instant(actionKey);
    this.snackbar.open(message, action, {
      duration: 2000,
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  prevImage(): void {
    if (this.petData?.petImages?.length && this.petData.petImages.length > 1) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.petData.petImages.length) %
        this.petData.petImages.length;
    }
  }

  nextImage(): void {
    if (this.petData?.petImages?.length && this.petData.petImages.length > 1) {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.petData.petImages.length;
    }
  }

  getTranslatedGender(genderId: number): string {
    return this.translatedPetGender[genderId - 1] || '';
  }

  getTranslatedBreed(breedId: number): string {
    const breed = this.translatedPetBreed.find((b) => b.id === breedId);
    return breed ? breed.name : '';
  }

  getTranslatedSize(sizeId: number): string {
    const size = this.translatedPetSizes.find((s) => s.id === sizeId);
    return size ? size.name : '';
  }

  getTranslatedCity(cityId: number): string {
    const city = this.translatedCities.find((c) => c.id === cityId);
    return city ? city.name : '';
  }

  getTranslatedPlacement(placementId: number): string {
    const placement = this.translatedPlacements.find(
      (p) => p.id === placementId,
    );
    return placement ? placement.name : '';
  }

  getTranslatedNatures(naturesIds: number[]): string {
    return naturesIds
      .map((natureId) => {
        const nature = this.translatedNatures.find((n) => n.id === natureId);
        return nature ? nature.name : '';
      })
      .join(', ');
  }

  openContactInfoDialog(): void {
    if (this.petData && this.petData.userId) {
      this.getUserContactInfo(this.petData.userId);
    } else {
      this.openSnackBar(LOAD_ERR, CLOSE);
    }
  }

  onCancel(): void {
    this.dialog.closeAll();
  }

  private getUserContactInfo(userId: Guid): void {
    this.isLoading = true;
    this.subs.add(
      this.userDataService.getUserContactInfo(userId).subscribe({
        next: (userData) => {
          this.userFirstName = userData.firstName;
          this.userLastName = userData.lastName;
          this.userPhoneNumber = userData.phoneNumber;
          this.isLoading = false;
          this.dialog.open(this.dialogTemplatUserContactInfo);
        },
        error: (err) => {
          this.isLoading = false;
          this.openSnackBar(LOAD_ERR, CLOSE);
        },
      }),
    );
  }

  private loadMetadata(): void {
    this.isLoading = true;
    this.subs.add(
      forkJoin({
        petGenderTypes: this.metadataService.getGenders(),
        petSizes: this.metadataService.getPetSizes(),
        petBreeds: this.metadataService.getBreeds(),
        natures: this.metadataService.getNatures(),
        placements: this.metadataService.getPlacements(),
        cities: this.metadataService.getCities(),
      }).subscribe({
        next: ({
          petGenderTypes,
          petSizes,
          petBreeds,
          natures,
          placements,
          cities,
        }) => {
          this.petGenderTypes = petGenderTypes;
          this.petSizes = petSizes;
          this.petBreeds = petBreeds;
          this.natures = natures;
          this.placements = placements;
          this.cities = cities;
          this.updateMetadataTranslations();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.openSnackBar(LOAD_ERR, CLOSE);
        },
      }),
    );
  }

  private updateMetadataTranslations(): void {
    this.translatedPetBreed = [];
    this.translatedPetSizes = [];
    this.translatedPetGender = [];
    this.translatedNatures = [];
    this.translatedPlacements = [];
    this.translatedCities = [];

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

    this.natures.forEach((nature) => {
      this.translate
        .get(`${PET_NATURE_TRANSLATION_KEY}.${nature.id}`)
        .subscribe((translation) => {
          this.translatedNatures.push({ ...nature, name: translation });
        });
    });

    this.placements.forEach((placement) => {
      this.translate
        .get(`${PET_PLACEMENT_TRANSLATION_KEY}.${placement.id}`)
        .subscribe((translation) => {
          this.translatedPlacements.push({ ...placement, name: translation });
        });
    });

    this.petBreeds.forEach((breed) => {
      this.translate
        .get(`${PET_BREED_TRANSLATION_KEY}.${breed.id}`)
        .subscribe((translation) => {
          this.translatedPetBreed.push({ ...breed, name: translation });
        });
    });

    this.petSizes.forEach((size) => {
      this.translate
        .get(`${PET_SIZE_TRANSLATION_KEY}.${size.id}`)
        .subscribe((translation) => {
          this.translatedPetSizes.push({ ...size, name: translation });
        });
    });

    this.petGenderTypes.forEach((gender) => {
      this.translate
        .get(`${PET_GENDER_TRANSLATION_KEY}.${gender.id}`)
        .subscribe((translation) => {
          this.translatedPetGender.push(translation);
        });
    });
  }
}
