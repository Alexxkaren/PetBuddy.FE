import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { Guid } from 'guid-typescript';
import { BaseDataService } from '../base-data.service/base-data.service';
import { PetDataDtoIn } from '../../models/pet/pet-data.interface';
import { PetService } from './pet-data.service';

class MockBaseDataService {
  postDataToEndpoint = jest.fn();
  getDataFromEndpoint = jest.fn();
}

describe('PetService', () => {
  let service: PetService;
  let baseDataService: MockBaseDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PetService,
        provideHttpClient(),
        { provide: BaseDataService, useClass: MockBaseDataService },
      ],
    });
    service = TestBed.inject(PetService);
    baseDataService = TestBed.inject(
      BaseDataService,
    ) as unknown as MockBaseDataService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post new pet data and update the buffer', () => {
    const newPet: PetDataDtoIn = {
      name: 'Buddy',
      age: 2,
      description: 'Friendly Dog',
      isVaccinated: true,
      hasMedicalPapers: false,
      genderId: 1,
      petNaturesIds: [1, 2],
      petSizeId: 1,
      breedId: 1,
      cityId: 1,
      petPlacementId: 1,
      photosIds: ['photo1', 'photo2'],
    };

    baseDataService.postDataToEndpoint.mockReturnValue(of(newPet));
    service.postNewPet(newPet).subscribe((data) => {
      expect(data).toEqual(newPet);
      expect(baseDataService.postDataToEndpoint).toHaveBeenCalledWith(
        'AddPet',
        newPet,
      );
    });
  });

  it('should get pet data by id', () => {
    const petId = 1;
    const petData = {
      name: 'Buddy',
      age: 2,
      description: 'Friendly Dog',
      isVaccinated: true,
      hasMedicalPapers: false,
      genderId: 1,
      petNaturesIds: [1, 2],
      petSizeId: 1,
      breedId: 1,
      cityId: 1,
      petPlacementId: 1,
      photosIds: ['photo1', 'photo2'],
    };

    baseDataService.getDataFromEndpoint.mockReturnValue(of(petData));
    service.getPetById(Guid.create()).subscribe((data) => {
      expect(data).toEqual(petData);
      expect(baseDataService.getDataFromEndpoint).toHaveBeenCalledWith(
        `GetPetById/${petId}`,
      );
    });
  });

  it('should delete pet data by id', () => {
    const petId = 1;
    baseDataService.getDataFromEndpoint.mockReturnValue(of({}));
    service.deletePetById(Guid.create()).subscribe(() => {
      expect(baseDataService.getDataFromEndpoint).toHaveBeenCalledWith(
        `DeletePetById/${petId}`,
      );
    });
  });

  it('should get pets profiles by user', () => {
    const petData = {
      name: 'Buddy',
      age: 2,
      description: 'Friendly Dog',
      isVaccinated: true,
      hasMedicalPapers: false,
      genderId: 1,
      petNaturesIds: [1, 2],
      petSizeId: 1,
      breedId: 1,
      cityId: 1,
      petPlacementId: 1,
      photosIds: ['photo1', 'photo2'],
    };

    baseDataService.getDataFromEndpoint.mockReturnValue(of([petData]));
    service.getPetsProfilesByUser().subscribe((data) => {
      expect(data).toEqual([petData]);
      expect(baseDataService.getDataFromEndpoint).toHaveBeenCalledWith(
        'GetPetsProfilesByUser',
      );
    });
  });

  it('should get filtered pets profiles', () => {
    const filterData = {
      cityId: 1,
      petSizeId: 1,
      petNaturesIds: [1, 2],
    };
    const petData = {
      name: 'Buddy',
      age: 2,
      description: 'Friendly Dog',
      isVaccinated: true,
      hasMedicalPapers: false,
      genderId: 1,
      petNaturesIds: [1, 2],
      petSizeId: 1,
      breedId: 1,
      cityId: 1,
      petPlacementId: 1,
      photosIds: ['photo1', 'photo2'],
    };

    baseDataService.getDataFromEndpoint.mockReturnValue(of([petData]));
    service.getFilteredPetsProfiles(filterData).subscribe((data) => {
      expect(data).toEqual([petData]);
      expect(baseDataService.getDataFromEndpoint).toHaveBeenCalledWith(
        'FilteredPetsProfiles',
        filterData,
      );
    });
  });
});
