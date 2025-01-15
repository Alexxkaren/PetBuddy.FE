import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatOptionModule,
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { USER_VALIDATION } from '../../../services/validation.service/validation.service';
import { UserDataService } from '../../../services/user-data/user-data.service';
import { UserDataDtoOut } from '../../../models/user/user-data.interface';
import { environment } from '../../../../environments/environment';
import { supportedLanguages } from '../../../models/infra/supported-languages.enum';
import { MetadataService } from '../../../services/metadata.service/metadata.service';
import { StateDto } from '../../../models/location/state.interface';
import { CityDto } from '../../../models/location/city.interface';

const CITY_TRANSLATION_KEY = 'cities';
const STATE_TRANSLATION_KEY = 'states';

const CLOSE = 'message.close';
const REGISTER_SUCCESS = 'message.register_success';
const REGISTER_ERROR = 'message.register_error';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatGridListModule,
    MatDialogModule,
    FormsModule,
    CommonModule,
    MatOptionModule,
    MatSelectModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'sk-SK' }],
  templateUrl: 'register-page.component.html',
  styleUrls: ['register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  @ViewChild('dialogTemplateRegister', { static: true })
  dialogTemplateRegister!: TemplateRef<unknown>;

  isLoading = false;
  submitted = false;
  formIsValid: boolean | undefined;
  today = new Date();

  translatedStates: StateDto[] = [];
  citySelection: CityDto[] = [];

  regForm = new FormGroup({
    firstName: new FormControl<string | null>('', USER_VALIDATION.firstName),
    lastName: new FormControl<string | null>('', USER_VALIDATION.lastName),
    dateOfBirth: new FormControl<Date | null>(
      null,
      USER_VALIDATION.dateOfBirth,
    ),
    streetAndNumber: new FormControl<string | null>('', USER_VALIDATION.state),
    email: new FormControl<string | null>('', USER_VALIDATION.email),
    phoneNumber: new FormControl<string | null>(
      '',
      USER_VALIDATION.phoneNumber,
    ),
    cityId: new FormControl<number | null>(
      { value: null, disabled: true },
      USER_VALIDATION.city,
    ),
    state: new FormControl<number | null>(null, USER_VALIDATION.state),
  });

  private readonly subs = new Subscription();

  private cities: CityDto[] = [];
  private states: StateDto[] = [];
  private translatedCities: CityDto[] = [];

  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private dialog: MatDialog,
    private auth: AuthService,
    private translate: TranslateService,
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
  get cityControl(): AbstractControl | null {
    return this.regForm.get('cityId');
  }
  get stateControl(): AbstractControl | null {
    return this.regForm.get('state');
  }

  ngOnInit(): void {
    this.loadMetadata();
    this.setLocale(this.translate.currentLang || environment.defaultLanguage);

    this.subs.add(
      this.translate.onLangChange.subscribe((event) => {
        this.setLocale(event.lang);
        this.updateMetadataTranslations();
      }),
    );

    this.subs.add(
      this.auth.user$.subscribe((user) => {
        if (user) {
          this.regForm.patchValue({
            firstName: user.given_name || '',
            lastName: user.family_name || '',
            dateOfBirth: user.birthdate ? new Date(user.birthdate) : null,
            streetAndNumber: user.address || '',
            email: user.email || '',
            phoneNumber: user.phone_number || '',
          });
          if (user.email) {
            this.emailControl?.disable();
          }
        }
      }),
    );
    this.openDialogTemplateRegister();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openDialogTemplateRegister(): void {
    const dialogRef = this.dialog.open(this.dialogTemplateRegister);
    this.subs.add(
      dialogRef.afterClosed().subscribe((result: unknown) => {
        if (result) {
          this.regForm.patchValue(result);
        }
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

  isInvalid(
    field: AbstractControl | null,
    error: string | null = null,
  ): boolean {
    const isInvalid = field
      ? field.invalid && (this.submitted || field.touched)
      : false;

    if (isInvalid && error) {
      return field?.errors?.[error];
    }

    return isInvalid;
  }

  navigateTo(page: string): void {
    this.router.navigate([page]);
  }

  submit(): void {
    this.submitted = true;
    this.formIsValid = this.regForm.valid;

    if (this.formIsValid) {
      this.registerUser();
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

  private registerUser(): void {
    this.submitted = true;
    if (this.regForm.invalid) {
      return;
    }

    const dateOfBirthValue = this.dateOfBirthControl?.value;

    const formattedDateOfBirth = dateOfBirthValue
      ? new Date(dateOfBirthValue).toISOString().split('T')[0]
      : '';

    const newUser: UserDataDtoOut = {
      firstName: this.firstNameControl?.value ?? '',
      lastName: this.lastNameControl?.value ?? '',
      dateOfBirth: formattedDateOfBirth,
      streetAndNumber: this.addressControl?.value ?? '',
      email: this.emailControl?.value ?? '',
      phoneNumber: this.phoneNumberControl?.value ?? '',
      cityId: this.cityControl?.value ?? 0,
    };

    this.isLoading = true;

    this.subs.add(
      this.userDataService.postNewUser(newUser).subscribe({
        next: () => {
          this.isLoading = false;
          setTimeout(() => {
            this.openSnackBar(REGISTER_SUCCESS, CLOSE);
            this.dialog.closeAll();
            this.router.navigate(['home']);
          }, 3000);
        },
        error: (err) => {
          this.isLoading = false;
          this.openSnackBar(REGISTER_ERROR, CLOSE);
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
