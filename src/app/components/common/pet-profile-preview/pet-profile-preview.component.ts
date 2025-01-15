import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Guid } from 'guid-typescript';
import { MatDialog } from '@angular/material/dialog';
import { PetPreviewDataDtoOut } from '../../../models/pet/pet-search-data.interface';
import { CityDto } from '../../../models/location/city.interface';
import { MetadataService } from '../../../services/metadata.service/metadata.service';
import { SpinnerComponent } from '../spinner/spinner.component';

const CITY_TRANSLATION_KEY = 'cities';

@Component({
  selector: 'app-pet-profile-preview',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    SpinnerComponent,
    CommonModule,
    MatIcon,
    TranslateModule,
  ],
  templateUrl: './pet-profile-preview.component.html',
  styleUrls: ['./pet-profile-preview.component.scss'],
})
export class PetProfilePreviewComponent implements OnInit, OnDestroy {
  @Input() pet!: PetPreviewDataDtoOut;
  @Input() translatedCities: CityDto[] = [];
  @Input() canDelete = false;
  @Output() petDeleted = new EventEmitter<Guid>();
  @ViewChild('dialogTemplateDeleteAnimal', { static: true })
  dialogTemplateDeleteAnimal!: TemplateRef<unknown>;
  isLoading = false;
  petId!: Guid;

  private cities: CityDto[] = [];
  private readonly subs = new Subscription();

  constructor(
    private metadataService: MetadataService,
    private translate: TranslateService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.subs.add(
      this.route.queryParams.subscribe((params) => {
        this.petId = params['id'];
      }),
    );
    this.metadataService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
        this.updateCityTranslations();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });

    this.subs.add(
      this.translate.onLangChange.subscribe(() => {
        this.updateCityTranslations();
      }),
    );
  }

  navigateTo(page: string, id: string): void {
    this.router.navigate([page], { queryParams: { id } });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getCityName(cityId: number): string {
    const city = this.translatedCities.find((c) => c.id === cityId);
    return city ? city.name : 'Unknown';
  }

  getGenderIcon(genderId: number): string {
    if (genderId === 1) {
      return 'male_icon.svg';
    } else if (genderId === 2) {
      return 'female_icon.svg';
    } else if (genderId === 3) {
      return 'hermaphrodite_icon.svg';
    } else {
      return 'unknown_icon.svg';
    }
  }

  openDeleteDialog(): void {
    this.dialog.open(this.dialogTemplateDeleteAnimal);
  }

  onDeleteConfirmed(petId: Guid): void {
    this.petDeleted.emit(petId);
    this.dialog.closeAll();
  }

  onCancel(): void {
    this.dialog.closeAll();
  }

  private updateCityTranslations(): void {
    this.translatedCities = this.cities.map((city) => {
      const translatedName = this.translate.instant(
        `${CITY_TRANSLATION_KEY}.${city.id}`,
      );
      return {
        ...city,
        name:
          translatedName !== `${CITY_TRANSLATION_KEY}.${city.id}`
            ? translatedName
            : city.name,
      };
    });
  }
}
