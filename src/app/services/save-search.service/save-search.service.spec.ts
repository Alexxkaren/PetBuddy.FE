import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { BaseDataService } from '../base-data.service/base-data.service';
import { SearchService } from './save-search.service';

class MockBaseDataService {
  postDataToEndpoint = jest.fn();
}
describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchService,
        provideHttpClient(),
        { provide: BaseDataService, useClass: MockBaseDataService },
      ],
    });
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
