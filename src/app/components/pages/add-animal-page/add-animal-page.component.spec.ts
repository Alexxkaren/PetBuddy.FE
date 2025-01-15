import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { PetService } from '../../../services/pet-data/pet-data.service';
import { ImageService } from '../../../services/images-service/image.service';
import { ValidationService } from '../../../services/validation.service/validation.service';
import { AddAnimalPageComponent } from './add-animal-page.component';

describe('AddAnimalPageComponent', () => {
  let component: AddAnimalPageComponent;
  let fixture: ComponentFixture<AddAnimalPageComponent>;
  let petServiceMock: jest.Mocked<PetService>;
  let snackbarMock: jest.Mocked<MatSnackBar>;
  let routerMock: jest.Mocked<Router>;
  let imageServiceMock: jest.Mocked<ImageService>;

  beforeEach(async () => {
    petServiceMock = {
      postNewPet: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<PetService>;

    snackbarMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBar>;

    routerMock = {
      navigate: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<Router>;

    imageServiceMock = {
      postNewPhotos: jest.fn(),
    } as unknown as jest.Mocked<ImageService>;

    await TestBed.configureTestingModule({
      imports: [
        AddAnimalPageComponent,
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
        { provide: PetService, useValue: petServiceMock },
        { provide: MatSnackBar, useValue: snackbarMock },
        { provide: Router, useValue: routerMock },
        { provide: ImageService, useValue: imageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAnimalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should change orientation on window resize', () => {
    component.stepperOrientation = 'horizontal';
    window.innerWidth = 600;
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    expect(component.stepperOrientation).toBe('vertical');
  });

  it('should not change orientation on window resize', () => {
    component.stepperOrientation = 'horizontal';
    window.innerWidth = 1024;
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    expect(component.stepperOrientation).toBe('horizontal');
  });

  it('should set stepper orientation to vertical on small screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    component.onResize();
    expect(component.stepperOrientation).toBe('vertical');
  });

  it('should set stepper orientation to horizontal on large screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    component.onResize();
    expect(component.stepperOrientation).toBe('horizontal');
  });

  it('should show required validation error on pet name if empty', () => {
    component.petNameControl?.setValue('');
    component.petNameControl?.markAsTouched();
    fixture.detectChanges();

    expect(component.petNameControl?.invalid).toBe(true);
    expect(component.isInvalid(component.petNameControl, 'required')).toBe(
      true,
    );
  });

  it('should show required validation error on pet name if not empty', () => {
    component.petNameControl?.setValue('Test');
    component.petNameControl?.markAsTouched();
    fixture.detectChanges();

    expect(component.petNameControl?.valid).toBe(true);
    expect(component.isInvalid(component.petNameControl, 'required')).toBe(
      false,
    );
  });

  it('should enable the city control when a state is selected', () => {
    component.stateControl?.setValue(1);
    component.onStateChange();
    fixture.detectChanges();

    expect(component.cityControl?.enabled).toBe(true);
  });

  it('should disable the city control when no state is selected', () => {
    component.stateControl?.setValue(null);
    component.onStateChange();
    fixture.detectChanges();

    expect(component.cityControl?.disabled).toBe(true);
  });

  it('should add and then remove a nature from the selection', () => {
    const natureId = 1;
    component.onNatureSelection(natureId);
    fixture.detectChanges();

    expect(component.selectedNatures.includes(natureId)).toBe(true);

    component.onNatureSelection(natureId);
    fixture.detectChanges();

    expect(component.selectedNatures.includes(natureId)).toBe(false);
  });

  it('should disable submit button when any required field is missing', fakeAsync(() => {
    component.secondStepForm.patchValue({
      streetAndNumber: '123 Test St',
      cityId: 1,
    });

    fixture.detectChanges();
    tick();

    expect(component.isButtonDisabled()).toBe(true);
  }));

  it('should return false if the field is valid', () => {
    const control = new FormControl('Valid', Validators.required);
    expect(component.isInvalid(control)).toBeFalsy();
  });

  it('should add valid files to selectedFiles', () => {
    component.selectedFiles = [];
    const validFile = new File([''], 'valid.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [validFile] } } as unknown as Event;

    jest.spyOn(ValidationService, 'validateFile').mockReturnValue(null);
    component.onFileSelected(event);

    expect(component.selectedFiles.length).toBe(1);
    expect(component.selectedFiles[0]).toBe(validFile);
  });

  it('should not add any files if no files are selected', () => {
    component.selectedFiles = [];
    const event = { target: { files: [] } } as unknown as Event;

    jest.spyOn(ValidationService, 'validateFile').mockReturnValue(null);
    component.onFileSelected(event);

    expect(component.selectedFiles.length).toBe(0);
  });

  it('should add multiple valid files to selectedFiles', () => {
    component.selectedFiles = [];

    const validFile1 = new File([''], 'valid1.jpg', { type: 'image/jpeg' });
    const validFile2 = new File([''], 'valid2.png', { type: 'image/png' });
    const event = {
      target: { files: [validFile1, validFile2] },
    } as unknown as Event;

    jest.spyOn(ValidationService, 'validateFile').mockReturnValue(null);

    component.onFileSelected(event);

    expect(component.selectedFiles.length).toBe(2);
    expect(component.selectedFiles).toEqual([validFile1, validFile2]);
  });

  it('should not add invalit file type', () => {
    component.selectedFiles = [];

    const invalidFile = new File([''], 'invalid.exe', {
      type: 'application/octet-stream',
    });

    const event = {
      target: { files: [invalidFile] },
    } as unknown as Event;

    jest
      .spyOn(ValidationService, 'validateFile')
      .mockReturnValue({ invalidFileType: true });

    component.onFileSelected(event);

    expect(component.selectedFiles.length).toBe(0);
  });

  it('should not add empty file (size 0) to selectedFiles', () => {
    const emptyFile = new File([''], 'empty.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [emptyFile] } } as unknown as Event;

    jest
      .spyOn(ValidationService, 'validateFile')
      .mockReturnValue({ invalidFileSize: true });

    component.onFileSelected(event);

    expect(component.selectedFiles.length).toBe(0);
  });

  it('should update translatedStates with correct values', () => {
    component['states'] = [{ id: 1, name: 'State1' }];
    component['updateMetadataTranslations']();
    expect(component.translatedStates).toEqual([{ id: 1, name: 'State1' }]);
  });

  it('should remove a file from selectedFiles', () => {
    const file = new File([''], 'valid.jpg', { type: 'image/jpeg' });
    component.selectedFiles = [file];
    component.removeFile(file);

    expect(component.selectedFiles.length).toBe(0);
  });

  it('should handle error when uploadPhotos fails', () => {
    const error = new Error('Upload error');
    component['selectedFiles'] = [new File([], 'photo1.png')];

    imageServiceMock.postNewPhotos.mockReturnValue(throwError(() => error));

    component['addNewPet']();

    expect(imageServiceMock.postNewPhotos).toHaveBeenCalled();
    expect(snackbarMock.open).toHaveBeenCalledWith(
      'message.photos_error',
      'message.close',
      { duration: 2000 },
    );
  });

  it('should update selectedPetType and filteredBreeds when onPetTypeSelect is called', () => {
    const petTypeId = 1;
    component['translatedPetBreeds'] = [
      { id: 1, name: 'Breed1', petTypeId: 1 },
      { id: 2, name: 'Breed2', petTypeId: 2 },
      { id: 3, name: 'Breed3', petTypeId: 1 },
    ];

    component.onPetTypeSelect(petTypeId);

    expect(component.selectedPetType).toEqual(petTypeId);
    expect(component.filteredBreeds).toEqual([
      { id: 1, name: 'Breed1', petTypeId: 1 },
      { id: 3, name: 'Breed3', petTypeId: 1 },
    ]);
    expect(component.fifthStepForm.get('petBreed')?.value).toBeNull();
  });

  it('should update selectedGenderType and thirdStepForm when onGenderTypeSelect is called', () => {
    const genderTypeId = 2;

    component.onGenderTypeSelect(genderTypeId);

    expect(component.selectedGenderType).toEqual(genderTypeId);
    expect(component.thirdStepForm.get('petGenderType')?.value).toEqual(
      genderTypeId,
    );
  });
});
