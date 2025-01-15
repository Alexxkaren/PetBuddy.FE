import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatOptionModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { forkJoin, Subscription } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { USER_VALIDATION } from '../../../services/validation.service/validation.service';
import { UserDataDtoOut } from '../../../models/user/user-data.interface';
import { UserDataService } from '../../../services/user-data/user-data.service';
import { environment } from '../../../../environments/environment.development';
import { supportedLanguages } from '../../../models/infra/supported-languages.enum';
import { MetadataService } from '../../../services/metadata.service/metadata.service';
import { StateDto } from '../../../models/location/state.interface';
import { CityDto } from '../../../models/location/city.interface';

const CITY_TRANSLATION_KEY = 'cities';
const STATE_TRANSLATION_KEY = 'states';
const SUCCESS_MESSAGE = 'message.success';
const ERROR_MESSAGE = 'message.error';
const CLOSE = 'message.close';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'sk-SK' }],
  templateUrl: 'profile-page.component.html',
  styleUrls: ['profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  @ViewChild('dialogTemplateBasicInfo', { static: true })
  dialogTemplateBasicInfo!: TemplateRef<unknown>;
  @ViewChild('dialogTemplateContactInfo', { static: true })
  dialogTemplateContactInfo!: TemplateRef<unknown>;
  submitted = false;
  isLoading = false;
  userData: UserDataDtoOut | undefined;
  today = new Date();

  citySelection: CityDto[] = [];
  translatedStates: StateDto[] = [];
  translatedCities: CityDto[] = [];

  regForm = new FormGroup({
    firstName: new FormControl<string | null>('', USER_VALIDATION.firstName),
    lastName: new FormControl<string | null>('', USER_VALIDATION.lastName),
    dateOfBirth: new FormControl<Date | null>(
      null,
      USER_VALIDATION.dateOfBirth,
    ),
    streetAndNumber: new FormControl<string | null>(''),
    email: new FormControl<string | null>(
      { value: '', disabled: true },
      USER_VALIDATION.email,
    ),
    phoneNumber: new FormControl<string | null>(
      '',
      USER_VALIDATION.phoneNumber,
    ),
    cityId: new FormControl<number | null>(null, USER_VALIDATION.city),
    cityName: new FormControl<string | null>(''),
    state: new FormControl<number | null>(null),
  });

  private cities: CityDto[] = [];
  private states: StateDto[] = [];

  private readonly subs = new Subscription();

  constructor(
    private readonly router: Router,
    private dialog: MatDialog,
    private translate: TranslateService,
    private userDataService: UserDataService,
    private dateAdapter: DateAdapter<Date>,
    private metadataService: MetadataService,
    private snackbar: MatSnackBar,
  ) {}

  get firstNameControl(): AbstractControl | null {
    return this.regForm.get('firstName');
  }
  get lastNameControl(): AbstractControl | null {
    return this.regForm.get('lastName');
  }
  get dateOfBirthControl(): AbstractControl | null {
    return this.regForm.get('dateOfBirth');
  }
  get addressControl(): AbstractControl | null {
    return this.regForm.get('streetAndNumber');
  }
  get emailControl(): AbstractControl | null {
    return this.regForm.get('email');
  }
  get phoneNumberControl(): AbstractControl | null {
    return this.regForm.get('phoneNumber');
  }
  get passwordControl(): AbstractControl | null {
    return this.regForm.get('password');
  }
  get cityIdControl(): AbstractControl | null {
    return this.regForm.get('cityId');
  }
  get cityControl(): AbstractControl | null {
    return this.regForm.get('cityId');
  }
  get stateControl(): AbstractControl | null {
    return this.regForm.get('state');
  }

  setFormData(): void {
    if (this.userData) {
      this.regForm.patchValue({
        firstName: this.userData.firstName || '',
        lastName: this.userData.lastName || '',
        dateOfBirth: this.userData.dateOfBirth
          ? new Date(this.userData.dateOfBirth)
          : null,
        streetAndNumber: this.userData.streetAndNumber || '',
        email: this.userData.email || '',
        phoneNumber: this.userData.phoneNumber || '',
        cityId: this.userData.cityId || null,
        state: this.userData.cityId
          ? this.getStateByCityId(this.userData.cityId)
          : null,
      });
      const selectedStateId = this.getStateByCityId(this.userData.cityId);
      if (selectedStateId) {
        this.citySelection = this.translatedCities.filter(
          (city) => city.stateId === selectedStateId,
        );
      }
    }
  }

  getStateByCityId(cityId: number): number | null {
    const city = this.cities.find((c) => c.id === cityId);
    return city ? city.stateId : null;
  }

  ngOnInit(): void {
    this.loadMetadata();
    this.userDataService.getUserData().subscribe({
      next: (userData) => {
        this.userData = userData;
        this.setFormData();
      },
      complete: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });

    this.setLocale(this.translate.currentLang || environment.defaultLanguage);

    this.subs.add(
      this.translate.onLangChange.subscribe((event) => {
        this.setLocale(event.lang);
        this.updateMetadataTranslations();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  submit(): void {
    if (this.regForm.valid) {
      this.isLoading = true;

      const updatedData: UserDataDtoOut = {
        firstName: this.firstNameControl?.value,
        lastName: this.lastNameControl?.value,
        dateOfBirth: this.dateOfBirthControl?.value
          ? new Date(this.dateOfBirthControl?.value).toISOString().split('T')[0]
          : '',
        streetAndNumber: this.addressControl?.value,
        email: this.emailControl?.value,
        phoneNumber: this.phoneNumberControl?.value,
        cityId: this.cityIdControl?.value,
      };

      this.subs.add(
        this.userDataService.updateUserData(updatedData).subscribe({
          next: (newUserData) => {
            this.userData = newUserData;
            this.setFormData();
            this.openSnackBar(SUCCESS_MESSAGE, CLOSE);
            this.dialog.closeAll();
          },
          complete: () => {
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            this.openSnackBar(ERROR_MESSAGE, CLOSE);
            this.dialog.closeAll();
          },
        }),
      );
    }
  }

  navigateTo(page: string): void {
    this.router.navigate([page]);
  }

  openDialogTemplateBasicInfo(): void {
    const dialogRef = this.dialog.open(this.dialogTemplateBasicInfo, {
      data: this.setFormData(),
    });
    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) {
        this.regForm.patchValue(result);
      }
    });
  }

  openDialogTemplateContactInfo(): void {
    const dialogRef = this.dialog.open(this.dialogTemplateContactInfo, {
      data: this.setFormData(),
    });
    dialogRef.afterClosed().subscribe((result: unknown) => {
      if (result) {
        this.regForm.patchValue(result);
      }
    });
  }

  openSnackBar(messageKey: string, actionKey: string): void {
    const message = this.translate.instant(messageKey);
    const action = this.translate.instant(actionKey);
    this.snackbar.open(message, action, {
      duration: 2000,
    });
  }

  onCancelForm(): void {
    this.setFormData();
    this.dialog.closeAll();
  }

  onStateChange(): void {
    const selectedStateId = this.stateControl?.value;
    if (selectedStateId) {
      this.citySelection = this.translatedCities.filter(
        (city) => city.stateId === selectedStateId,
      );
    }
  }

  isInvalid(field: AbstractControl | null): boolean {
    if (!field) {
      return false;
    }
    if (this.submitted) {
      return field.invalid;
    }
    return field.invalid && (field.dirty || field.touched);
  }

  getCityName(cityId?: number): string {
    if (!cityId) {
      return '';
    }
    const foundCity = this.translatedCities.find(
      (cityItem) => cityItem.id === cityId,
    );
    return foundCity ? foundCity.name : '';
  }

  getStateName(cityId?: number): string {
    if (!cityId) {
      return '';
    }
    const foundCity = this.cities.find((cityItem) => cityItem.id === cityId);
    return foundCity && foundCity.stateId
      ? this.getStateById(foundCity.stateId)
      : '';
  }

  private getStateById(stateId: number): string {
    const foundState = this.translatedStates.find(
      (stateItem) => stateItem.id === stateId,
    );
    return foundState ? foundState.name : '';
  }

  private updateMetadataTranslations(): void {
    this.translatedCities = [];
    this.translatedStates = [];

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

    this.cities.forEach((cityItem) => {
      const translatedCity = this.translate.instant(
        `${CITY_TRANSLATION_KEY}.${cityItem.id}`,
      );
      this.translatedCities.push({
        id: cityItem.id,
        name:
          translatedCity !== `${CITY_TRANSLATION_KEY}.${cityItem.id}`
            ? translatedCity
            : cityItem.name,
        stateId: cityItem.stateId,
      });
    });

    this.onStateChange();
  }

  private loadMetadata(): void {
    const cities$ = this.metadataService.getCities();
    const states$ = this.metadataService.getStates();

    this.isLoading = true;
    this.subs.add(
      forkJoin([cities$, states$]).subscribe({
        next: ([cities, states]) => {
          if (cities) {
            this.cities = cities;
          }
          if (states) {
            this.states = states;
          }
        },
        error: () => (this.isLoading = false),
        complete: () => {
          this.isLoading = false;
          this.updateMetadataTranslations();
        },
      }),
    );
  }

  private setLocale(lang: string) {
    const supportedLang = supportedLanguages.find(
      (language) => language.Code === lang,
    );

    const locale = supportedLang
      ? supportedLang.Code
      : environment.defaultLanguage;
    this.dateAdapter.setLocale(locale);
  }
}
