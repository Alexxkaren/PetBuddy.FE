import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { environment } from '../../../environments/environment';
import {
  UserDataDtoIn,
  UserDataDtoOut,
} from '../../models/user/user-data.interface';
import { MetadataService } from '../metadata.service/metadata.service';
import { UserDataService } from './user-data.service';

jest.mock('../metadata.service/metadata.service');
jest.mock('@angular/router');

describe('UserDataService', () => {
  let service: UserDataService;
  let httpMock: HttpTestingController;

  const BASE_URL = environment.apiUrl;
  const paths = {
    controller: 'UserData',
    addUser: 'AddUser',
    updateUser: 'UpdateUserInfo',
    isRegistered: 'IsRegistered',
  };

  const mockGuid = Guid.create();

  const mockUserDataDtoIn: UserDataDtoIn = {
    id: mockGuid,
    firstName: 'test_first_name',
    lastName: 'test_last_name',
    dateOfBirth: '01/01/2000',
    streetAndNumber: 'test_address',
    email: 'test_email@test.com',
    phoneNumber: '1234567890',
    cityId: 0,
  };

  const mockUserDataDtoOut: UserDataDtoOut = {
    firstName: 'test_first_name',
    lastName: 'test_last_name',
    dateOfBirth: '01/01/2000',
    streetAndNumber: 'test_address',
    email: 'test_email@test.com',
    phoneNumber: '1234567890',
    cityId: 0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserDataService,
        { provide: MetadataService, useValue: jest.mocked<MetadataService> },
        { provide: Router, useValue: jest.mocked<Router> },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(UserDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new user', () => {
    service.postNewUser(mockUserDataDtoOut).subscribe((data) => {
      expect(data).toEqual(mockUserDataDtoIn);
    });

    const req = httpMock.expectOne(
      `${BASE_URL}/${paths.controller}/${paths.addUser}`,
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockUserDataDtoIn);
  });

  it('should handle error when adding a new user', () => {
    service.postNewUser(mockUserDataDtoOut).subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      },
    });

    const req = httpMock.expectOne(
      `${BASE_URL}/${paths.controller}/${paths.addUser}`,
    );
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should update user data', () => {
    service.updateUserData(mockUserDataDtoOut).subscribe((data) => {
      expect(data).toEqual(mockUserDataDtoIn);
    });

    const req = httpMock.expectOne(
      `${BASE_URL}/${paths.controller}/${paths.updateUser}`,
    );
    expect(req.request.method).toBe('PUT');
    req.flush(mockUserDataDtoIn);
  });

  it('should handle error when updating user data', () => {
    service.updateUserData(mockUserDataDtoOut).subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      },
    });

    const req = httpMock.expectOne(
      `${BASE_URL}/${paths.controller}/${paths.updateUser}`,
    );
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should check if user is registered', () => {
    service.checkIfUserIsRegistered().subscribe((data) => {
      expect(data).toBe(true);
    });

    const req = httpMock.expectOne(
      `${BASE_URL}/${paths.controller}/${paths.isRegistered}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should handle error when checking if user is registered', () => {
    service.checkIfUserIsRegistered().subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      },
    });

    const req = httpMock.expectOne(
      `${BASE_URL}/${paths.controller}/${paths.isRegistered}`,
    );
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should get user data from buffer if available and refreshBuffer is false', () => {
    service['_userDataBuffer'] = mockUserDataDtoIn;
    service.getUserData(false).subscribe((data) => {
      expect(data).toEqual(mockUserDataDtoIn);
    });
  });
});
