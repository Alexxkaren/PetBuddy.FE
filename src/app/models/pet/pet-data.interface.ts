import { Guid } from 'guid-typescript';

export interface PetDataDto {
  name: string;
  age: number;
  description: string;
  isVaccinated: boolean;
  hasMedicalPapers: boolean;
  photosIds: string[];
  genderId: number;
  petNaturesIds: number[];
  petSizeId: number;
  breedId: number;
  cityId: number;
  petPlacementId: number;
  petImages?: string[];
  userId?: Guid;
}

export interface PetDataDtoOut extends PetDataDto {
  id: Guid;
}

export interface PetDataDtoIn extends PetDataDto {}

export interface PetBreedDto {
  id: number;
  name: string;
  petTypeId: number;
}

export interface PetSizeDto {
  id: number;
  name: string;
}

export interface PetTypeDto {
  id: number;
  name: string;
}

export interface PetGenderTypeDto {
  id: number;
  name: string;
}

export interface PetNatureDto {
  id: number;
  name: string;
}

export interface PetPlacementDto {
  id: number;
  name: string;
}

export interface ImageResponse {
  photosIds: string[];
}
