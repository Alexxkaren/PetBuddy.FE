import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { BaseDataService } from '../base-data.service/base-data.service';
import { PetDataDto, PetDataDtoIn } from '../../models/pet/pet-data.interface';
import {
  PetPreviewDataDtoOut,
  PetSearchDataDtoIn,
} from '../../models/pet/pet-search-data.interface';

const paths = {
  controller: 'PetData',
  addPet: 'AddPet',
  petProfiles: 'FilteredPetsProfiles',
  getPetByUser: 'GetPetsProfilesByUser',
  petById: 'GetPetById/{id}',
  delete: 'DeletePetById/{id}',
};

@Injectable({
  providedIn: 'root',
})
export class PetService extends BaseDataService {
  constructor() {
    super(paths.controller);
  }

  // Adding new pet
  postNewPet(newPet: PetDataDtoIn): Observable<PetDataDtoIn> {
    return this.postDataToEndpoint<PetDataDtoIn>(paths.addPet, newPet);
  }

  // Getting filtered pets profiles
  getFilteredPetsProfiles(
    filterData: Partial<PetSearchDataDtoIn>,
  ): Observable<PetPreviewDataDtoOut[]> {
    const params: Record<
      string,
      string | number | boolean | readonly (string | number | boolean)[]
    > = {};

    Object.keys(filterData).forEach((key) => {
      const value = filterData[key as keyof PetSearchDataDtoIn];
      if (value !== null && value !== undefined) {
        params[key] = value;
      }
    });

    const queryParams = Object.keys(params).length > 0 ? params : undefined;

    return this.getDataFromEndpoint<PetPreviewDataDtoOut[]>(
      paths.petProfiles,
      queryParams,
    );
  }

  // Getting pets profiles by user
  getPetsProfilesByUser(): Observable<PetPreviewDataDtoOut[]> {
    return this.getDataFromEndpoint<PetPreviewDataDtoOut[]>(paths.getPetByUser);
  }

  // Getting all info about pet by id
  getPetById(id: Guid): Observable<PetDataDto> {
    const url = paths.petById.replace('{id}', id.toString());
    return this.getDataFromEndpoint<PetDataDto>(url);
  }

  // Deleting pet by id
  deletePetById(id: Guid): Observable<void> {
    const url = paths.delete.replace('{id}', id.toString());
    return this.deleteDataFromEndpoint<void>(url);
  }
}
