import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CityDto } from '../../models/location/city.interface';
import { StateDto } from '../../models/location/state.interface';
import {
  PetBreedDto,
  PetGenderTypeDto,
  PetNatureDto,
  PetPlacementDto,
  PetSizeDto,
  PetTypeDto,
} from '../../models/pet/pet-data.interface';

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  paths = {
    controller: 'Metadata',
    city: 'GetCityMetadata',
    state: 'GetStateMetadata',
    gender: 'GetGenderMetadata',
    petSize: 'GetPetSizeMetadata',
    breed: 'GetBreedMetadata',
    petType: 'GetPetTypeMetadata',
    nature: 'GetPetNatureMetadata',
    placement: 'GetPetPlacements',
  };

  private _citiesBuffer: CityDto[] | null = null;
  private _statesBuffer: StateDto[] | null = null;
  private _gendersBuffer: PetGenderTypeDto[] | null = null;
  private _petSizesBuffer: PetSizeDto[] | null = null;
  private _breedsBuffer: PetBreedDto[] | null = null;
  private _petTypesBuffer: PetTypeDto[] | null = null;
  private _naturesBuffer: PetNatureDto[] | null = null;
  private _placementsBuffer: PetPlacementDto[] | null = null;

  constructor(private readonly http: HttpClient) {}

  getCities(refreshBuffer: boolean = false): Observable<CityDto[]> {
    if (this._citiesBuffer && !refreshBuffer) {
      return of(this._citiesBuffer);
    }

    const url = `${environment.apiUrl}/${this.paths.controller}/${this.paths.city}`;
    return this.http.get<CityDto[]>(url).pipe(
      tap((cities) => (this._citiesBuffer = cities)),
      shareReplay(1),
    );
  }

  getStates(refreshBuffer: boolean = false): Observable<StateDto[]> {
    if (this._statesBuffer && !refreshBuffer) {
      return of(this._statesBuffer);
    }

    const url = `${environment.apiUrl}/${this.paths.controller}/${this.paths.state}`;
    return this.http.get<StateDto[]>(url).pipe(
      tap((states) => (this._statesBuffer = states)),
      shareReplay(1),
    );
  }

  getPetTypes(refreshBuffer: boolean = false): Observable<PetTypeDto[]> {
    if (this._petTypesBuffer && !refreshBuffer) {
      return of(this._petTypesBuffer);
    }

    const url = `${environment.apiUrl}/${this.paths.controller}/${this.paths.petType}`;
    return this.http.get<PetTypeDto[]>(url).pipe(
      tap((types) => (this._petTypesBuffer = types)),
      shareReplay(1),
    );
  }

  getGenders(refreshBuffer: boolean = false): Observable<PetGenderTypeDto[]> {
    if (this._gendersBuffer && !refreshBuffer) {
      return of(this._gendersBuffer);
    }

    const url = `${environment.apiUrl}/${this.paths.controller}/${this.paths.gender}`;
    return this.http.get<PetGenderTypeDto[]>(url).pipe(
      tap((genders) => (this._gendersBuffer = genders)),
      shareReplay(1),
    );
  }

  getNatures(refreshBuffer: boolean = false): Observable<PetNatureDto[]> {
    if (this._naturesBuffer && !refreshBuffer) {
      return of(this._naturesBuffer);
    }

    const url = `${environment.apiUrl}/${this.paths.controller}/${this.paths.nature}`;
    return this.http.get<PetNatureDto[]>(url).pipe(
      tap((natures) => (this._naturesBuffer = natures)),
      shareReplay(1),
    );
  }

  getBreeds(refreshBuffer: boolean = false): Observable<PetBreedDto[]> {
    if (this._breedsBuffer && !refreshBuffer) {
      return of(this._breedsBuffer);
    }

    const url = `${environment.apiUrl}/${this.paths.controller}/${this.paths.breed}`;
    return this.http.get<PetBreedDto[]>(url).pipe(
      tap((breeds) => (this._breedsBuffer = breeds)),
      shareReplay(1),
    );
  }

  getPetSizes(refreshBuffer: boolean = false): Observable<PetSizeDto[]> {
    if (this._petSizesBuffer && !refreshBuffer) {
      return of(this._petSizesBuffer);
    }

    const url = `${environment.apiUrl}/${this.paths.controller}/${this.paths.petSize}`;
    return this.http.get<PetSizeDto[]>(url).pipe(
      tap((sizes) => (this._petSizesBuffer = sizes)),
      shareReplay(1),
    );
  }

  getPlacements(refreshBuffer: boolean = false): Observable<PetPlacementDto[]> {
    if (this._placementsBuffer && !refreshBuffer) {
      return of(this._placementsBuffer);
    }

    const url = `${environment.apiUrl}/${this.paths.controller}/${this.paths.placement}`;
    return this.http.get<PetPlacementDto[]>(url).pipe(
      tap((placements) => (this._placementsBuffer = placements)),
      shareReplay(1),
    );
  }
}
