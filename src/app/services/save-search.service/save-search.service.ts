import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from '../base-data.service/base-data.service';
import { PetSearchDataDtoIn } from '../../models/pet/pet-search-data.interface';

const paths = {
  controller: 'SavedSearchData',
  save: 'SaveSearch',
};

@Injectable({
  providedIn: 'root',
})
export class SearchService extends BaseDataService {
  constructor() {
    super(paths.controller);
  }

  saveSearch(searchData: PetSearchDataDtoIn): Observable<PetSearchDataDtoIn> {
    return this.postDataToEndpoint<PetSearchDataDtoIn>(paths.save, searchData);
  }
}
