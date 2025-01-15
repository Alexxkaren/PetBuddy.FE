import {
  AbstractControl,
  ValidationErrors,
  Validators,
  ValidatorFn,
} from '@angular/forms';

export const PHONE_NUM_REGEX = /^\+(421)[0-9]{9}$/;
export const ONLY_LETTERS_AND_SPACES_REGEX = /^[a-zA-Z\u00C0-\u017F\s]+$/;
export const MAX_FILE_SIZE = 10; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

export class ValidationService {
  static ageValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dateOfBirth = new Date(control.value);
      const age = new Date().getFullYear() - dateOfBirth.getFullYear();

      return age < minAge
        ? { ageMin: { requiredAge: minAge, actualAge: age } }
        : null;
    };
  }

  static petAgeValidator(minAge: number, maxAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const age = control.value;

      if (age == null || age === '') {
        return null;
      }
      if (isNaN(age)) {
        return { numbers_only: true };
      }
      if (age < minAge || age > maxAge) {
        return { wrongAge: { minAge, maxAge, actualAge: age } };
      }

      return null;
    };
  }

  static validateFile(file: File): ValidationErrors | null {
    if (!file || !(file instanceof File)) {
      return null;
    }
    if (file.size > MAX_FILE_SIZE * 1024 * 1024 || file.size === 0) {
      return { invalidFileSize: true };
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return { invalidFileType: true };
    }
    return null;
  }
}

export const USER_VALIDATION = {
  firstName: [
    Validators.required,
    Validators.pattern(ONLY_LETTERS_AND_SPACES_REGEX),
  ],
  lastName: [
    Validators.required,
    Validators.pattern(ONLY_LETTERS_AND_SPACES_REGEX),
  ],
  dateOfBirth: [Validators.required, ValidationService.ageValidator(18)],
  streetAndNumber: [Validators.required],
  email: [Validators.required, Validators.email],
  phoneNumber: [Validators.required, Validators.pattern(PHONE_NUM_REGEX)],
  city: [Validators.required],
  state: [Validators.required],
  password: [Validators.required],
};

export const PET_VALIDATION = {
  name: [
    Validators.required,
    Validators.pattern(ONLY_LETTERS_AND_SPACES_REGEX),
  ],
  age: [Validators.required, ValidationService.petAgeValidator(0, 100)],
  streetAndNumber: [Validators.required],
  city: [Validators.required],
  state: [Validators.required],
  description: [Validators.required],
  petSizeId: [Validators.required],
};
