import { Guid } from 'guid-typescript';

export interface PetSearchDataDtoBase {
  genderId: number | null;
  petSizeId: number | null;
  breedId: number | null;
  cityId: number | null;
  petPlacementId: number | null;
  petTypeId: number | null;
}

export interface PetSearchDataDtoIn extends PetSearchDataDtoBase {}

export interface PetPreviewDataDtoOut {
  imagePreview: string;
  genderId: number;
  name: string;
  cityId: number;
  id: Guid;
}
