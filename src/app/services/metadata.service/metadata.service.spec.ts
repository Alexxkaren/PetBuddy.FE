import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CityDto } from '../../models/location/city.interface';
import { StateDto } from '../../models/location/state.interface';
import { MetadataService } from './metadata.service';

describe('MetadataService', () => {
  let service: MetadataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        MetadataService,
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(MetadataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch states', () => {
    const mockStates: StateDto[] = [
      { id: 1, name: 'Slovakia' },
      { id: 2, name: 'Czech Republic' },
    ];

    service.getStates().subscribe((states) => {
      expect(states).toEqual(mockStates);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/Metadata/GetStateMetadata`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockStates);
  });

  it('should call the correct URL for getCities', () => {
    const mockCities: CityDto[] = [
      { id: 1, name: 'Kosice', stateId: 1 },
      { id: 2, name: 'Bratislava', stateId: 2 },
    ];

    service.getCities().subscribe((cities) => {
      expect(cities).toEqual(mockCities);
    });

    const expectedUrl = `${environment.apiUrl}/${service.paths.controller}/${service.paths.city}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCities);
  });

  it('should call the correct URL for getStates', () => {
    const mockStates: StateDto[] = [
      { id: 1, name: 'Slovakia' },
      { id: 2, name: 'Czech Republic' },
    ];

    service.getStates().subscribe((states) => {
      expect(states).toEqual(mockStates);
    });

    const expectedUrl = `${environment.apiUrl}/${service.paths.controller}/${service.paths.state}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockStates);
  });

  it('should handle error when fetching states', () => {
    service.getStates().subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      },
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/Metadata/GetStateMetadata`,
    );
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should get pet types', () => {
    const mockPetTypes = [
      { id: 1, name: 'Dog' },
      { id: 2, name: 'Cat' },
    ];

    service.getPetTypes().subscribe((petTypes) => {
      expect(petTypes).toEqual(mockPetTypes);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/Metadata/GetPetTypeMetadata`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPetTypes);
  });

  it('should fetch pet sizes', () => {
    const mockPetSizes = [
      { id: 1, name: 'Small' },
      { id: 2, name: 'Large' },
    ];

    service.getPetSizes().subscribe((petSizes) => {
      expect(petSizes).toEqual(mockPetSizes);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/Metadata/GetPetSizeMetadata`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPetSizes);
  });

  it('should fetch genders', () => {
    const mockGenders = [
      { id: 1, name: 'Male' },
      { id: 2, name: 'Female' },
    ];

    service.getGenders().subscribe((genders) => {
      expect(genders).toEqual(mockGenders);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/Metadata/GetGenderMetadata`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockGenders);
  });

  it('should fetch natures', () => {
    const mockNatures = [
      { id: 1, name: 'Friendly' },
      { id: 2, name: 'Aggressive' },
    ];

    service.getNatures().subscribe((natures) => {
      expect(natures).toEqual(mockNatures);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/Metadata/GetPetNatureMetadata`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockNatures);
  });

  it('should fetch breeds', () => {
    const mockBreeds = [
      { id: 1, name: 'Golden Retriever' },
      { id: 2, name: 'Bulldog' },
    ];

    service.getBreeds().subscribe((breeds) => {
      expect(breeds).toEqual(mockBreeds);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/Metadata/GetBreedMetadata`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockBreeds);
  });

  it('should fetch placements', () => {
    const mockPlacements = [
      { id: 1, name: 'Adoptable' },
      { id: 2, name: 'Foster' },
    ];

    service.getPlacements().subscribe((placements) => {
      expect(placements).toEqual(mockPlacements);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/Metadata/GetPetPlacements`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPlacements);
  });

  it('should handle error when fetching pet sizes', () => {
    service.getPetSizes().subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      },
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/Metadata/GetPetSizeMetadata`,
    );
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle error when fetching genders', () => {
    service.getGenders().subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      },
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/Metadata/GetGenderMetadata`,
    );
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle error when fetching natures', () => {
    service.getNatures().subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      },
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/Metadata/GetPetNatureMetadata`,
    );
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle error when fetching breeds', () => {
    service.getBreeds().subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      },
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/Metadata/GetBreedMetadata`,
    );
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle error when fetching placements', () => {
    service.getPlacements().subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      },
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/Metadata/GetPetPlacements`,
    );
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });
});
