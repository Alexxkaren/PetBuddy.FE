import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseDataService } from './base-data.service';

class MockBaseDataService extends BaseDataService {
  constructor() {
    super('TestController');
  }
}

describe('BaseDataService', () => {
  let service: MockBaseDataService;
  let httpMock: HttpTestingController;

  const testData = { id: 1, name: 'Test' };
  const expectedUrl = `${environment.apiUrl}/TestController/test`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BaseDataService, useClass: MockBaseDataService },
      ],
    });

    service = TestBed.inject(BaseDataService) as MockBaseDataService;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a mock HTTP GET request', () => {
    service.getDataFromEndpoint('test').subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });

  it('should perform a mock HTTP POST request', () => {
    service.postDataToEndpoint('test', testData).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(testData);
  });

  it('should perform a mock HTTP PUT request', () => {
    service.putDataAtEndpoint('test', testData).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(testData);
  });

  it('should perform a mock HTTP DELETE request', () => {
    service.deleteDataFromEndpoint('test').subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(testData);
  });
});
