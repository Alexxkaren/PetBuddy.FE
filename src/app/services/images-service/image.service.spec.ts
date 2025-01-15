import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { BaseDataService } from '../base-data.service/base-data.service';
import { ImageService } from './image.service';

class MockBaseDataService {
  postDataToEndpoint = jest.fn();
}

describe('ImageService', () => {
  let service: ImageService;
  let baseDataService: MockBaseDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ImageService,
        provideHttpClient(),
        { provide: BaseDataService, useClass: MockBaseDataService },
      ],
    });
    service = TestBed.inject(ImageService);
    baseDataService = TestBed.inject(
      BaseDataService,
    ) as unknown as MockBaseDataService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('postNewPhotos', () => {
    it('should construct FormData and post it to the endpoint', () => {
      const mockFiles = [
        new File(['photo-content'], 'photo1.jpg'),
        new File(['photo-content'], 'photo2.jpg'),
      ];

      const expectedFormData = new FormData();
      expectedFormData.append('PhotoFiles', mockFiles[0], 'photo_0');
      expectedFormData.append('PhotoFiles', mockFiles[1], 'photo_1');

      baseDataService.postDataToEndpoint.mockReturnValue(of({ success: true }));

      service.postNewPhotos(mockFiles).subscribe((response) => {
        expect(response).toEqual({ success: true });
        expect(baseDataService.postDataToEndpoint).toHaveBeenCalledWith(
          'AddPhotos',
          expectedFormData,
        );

        const formDataCalls =
          baseDataService.postDataToEndpoint.mock.calls[0][1];
        expect(formDataCalls instanceof FormData).toBeTruthy();
        expect(formDataCalls.getAll('PhotoFiles').length).toBe(2);
      });
    });
  });
});
