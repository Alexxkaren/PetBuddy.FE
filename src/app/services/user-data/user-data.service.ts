import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Guid } from 'guid-typescript';
import {
  UserDataDtoIn,
  UserDataDtoOut,
} from '../../models/user/user-data.interface';
import { BaseDataService } from '../base-data.service/base-data.service';

const paths = {
  controller: 'UserData',
  addUser: 'AddUser',
  updateUser: 'UpdateUserInfo',
  isRegistered: 'IsRegistered',
  getData: 'GetUserInfo',
  getContact: 'GetUserContactInfoById/{userId}',
};

@Injectable({
  providedIn: 'root',
})
export class UserDataService extends BaseDataService {
  private _userDataBuffer: UserDataDtoIn | null = null;

  constructor() {
    super(paths.controller);
  }

  // Adding new user
  postNewUser(newUser: UserDataDtoOut): Observable<UserDataDtoIn> {
    return this.postDataToEndpoint<UserDataDtoIn>(paths.addUser, newUser).pipe(
      tap((data) => {
        this._userDataBuffer = data;
      }),
    );
  }

  // Updating user data
  updateUserData(userData: UserDataDtoOut): Observable<UserDataDtoIn> {
    return this.putDataAtEndpoint<UserDataDtoIn>(
      paths.updateUser,
      userData,
    ).pipe(tap((data) => (this._userDataBuffer = data)));
  }

  // Getting user data
  getUserData(refreshBuffer: boolean = false): Observable<UserDataDtoIn> {
    if (this._userDataBuffer && !refreshBuffer) {
      return of(this._userDataBuffer);
    }
    return this.getDataFromEndpoint<UserDataDtoIn>(paths.getData).pipe(
      tap((data) => {
        this._userDataBuffer = data;
      }),
    );
  }

  // Checking if user is registered
  checkIfUserIsRegistered(): Observable<boolean> {
    return this.getDataFromEndpoint<boolean>(paths.isRegistered).pipe(
      catchError(() => of(false)),
    );
  }

  // Getting user contact info
  getUserContactInfo(userId: Guid): Observable<UserDataDtoIn> {
    return this.getDataFromEndpoint<UserDataDtoIn>(
      paths.getContact.replace('{userId}', userId.toString()),
    );
  }
}
