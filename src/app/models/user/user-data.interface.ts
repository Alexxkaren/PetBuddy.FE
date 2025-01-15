import { Guid } from 'guid-typescript';

interface UserDataDtoBase {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  streetAndNumber: string;
  email: string;
  phoneNumber: string;
  cityId: number;
}

export interface UserDataDtoOut extends UserDataDtoBase {}

export interface UserDataDtoIn extends UserDataDtoBase {
  id: Guid;
}
