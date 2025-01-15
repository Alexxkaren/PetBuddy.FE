import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from '../base-data.service/base-data.service';
import { ImageResponse } from '../../models/pet/pet-data.interface';

const paths = {
  controller: 'StorageData',
  photos: 'AddPhotos',
};

@Injectable({
  providedIn: 'root',
})
export class ImageService extends BaseDataService {
  constructor() {
    super(paths.controller);
  }

  // Adding new photos
  postNewPhotos(newPhotos: File[]): Observable<ImageResponse> {
    const formData = new FormData();
    newPhotos.forEach((photo, index) => {
      formData.append('PhotoFiles', photo, `photo_${index}`);
    });

    return this.postDataToEndpoint<ImageResponse>(paths.photos, formData);
  }
}
