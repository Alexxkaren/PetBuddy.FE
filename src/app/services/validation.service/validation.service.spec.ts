import { AbstractControl } from '@angular/forms';
import { MAX_FILE_SIZE, ValidationService } from './validation.service';

describe('ValidationService', () => {
  it('should create an instance', () => {
    expect(new ValidationService()).toBeTruthy();
  });

  it('should return true if user is older than 18', () => {
    const minAge = 18;
    const control: Partial<AbstractControl> = {
      value: '2003-01-01',
    };
    const result = ValidationService.ageValidator(minAge)(
      control as AbstractControl,
    );
    expect(result).toBeNull();
  });

  it('should return true if pet is older than 0 and younger than 30', () => {
    const minAge = 0;
    const maxAge = 30;
    const control: Partial<AbstractControl> = {
      value: 5,
    };
    const result = ValidationService.petAgeValidator(
      minAge,
      maxAge,
    )(control as AbstractControl);
    expect(result).toBeNull();
  });

  it('should return invalidFileSize if file size is zero', () => {
    const emptyFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const result = ValidationService.validateFile(emptyFile);
    expect(result).toEqual({ invalidFileSize: true });
  });

  it('should return invalidFileType if file type is not supported', () => {
    const largeFileContent = new Array(MAX_FILE_SIZE + 1).join('a');
    const unsupportedFile = new File([largeFileContent], 'test.pdf', {
      type: 'application/pdf',
    });
    const result = ValidationService.validateFile(unsupportedFile);
    expect(result).toEqual({ invalidFileType: true });
  });

  it('should return null if file is valid', () => {
    const largeFileContent = new Array(MAX_FILE_SIZE + 1).join('a');
    const validFile = new File([largeFileContent], 'test.jpg', {
      type: 'image/jpeg',
    });
    const result = ValidationService.validateFile(validFile);
    expect(result).toBeNull();
  });
});
