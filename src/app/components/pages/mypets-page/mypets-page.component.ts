import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { Guid } from 'guid-typescript';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PetPreviewDataDtoOut } from '../../../models/pet/pet-search-data.interface';
import { PetProfilePreviewComponent } from '../../common/pet-profile-preview/pet-profile-preview.component';
import { PetService } from '../../../services/pet-data/pet-data.service';
import { SpinnerComponent } from '../../common/spinner/spinner.component';

const CLOSE = 'message.close';
const PET_DELETED = 'message.pet_deleted';
const PET_NOT_DELETED = 'message.pet_not_deleted';

@Component({
  selector: 'app-mypets-page',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    PetProfilePreviewComponent,
    MatIcon,
    CommonModule,
    SpinnerComponent,
  ],
  templateUrl: 'mypets-page.component.html',
  styleUrls: ['mypets-page.component.scss'],
})
export class MyPetsPageComponent implements OnInit, OnDestroy {
  displayedPets: PetPreviewDataDtoOut[] = [];
  pets: PetPreviewDataDtoOut[] = [];
  pageSize = 3;
  currentPage = 0;
  totalPages = 0;
  isLoading = false;

  private readonly subs = new Subscription();

  constructor(
    private readonly router: Router,
    private petService: PetService,
    private translate: TranslateService,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.subs.add(
      this.petService.getPetsProfilesByUser().subscribe({
        next: (pets) => {
          this.pets = pets;
          this.totalPages = Math.ceil(this.pets.length / this.pageSize);
          this.updateDisplayedPets();
          this.isLoading = false;
        },
      }),
    );
  }

  onPetDeleted(petId: Guid): void {
    this.isLoading = true;
    this.subs.add(
      this.petService.deletePetById(petId).subscribe({
        next: () => {
          this.openSnackBar(PET_DELETED, CLOSE);
          this.pets = this.pets.filter((pet) => pet.id !== petId);
          this.totalPages = Math.ceil(this.pets.length / this.pageSize);
          this.updateDisplayedPets();
          this.isLoading = false;
        },
        error: () => {
          this.openSnackBar(PET_NOT_DELETED, CLOSE);
          this.isLoading = false;
        },
      }),
    );
  }

  openSnackBar(messageKey: string, actionKey: string): void {
    const message = this.translate.instant(messageKey);
    const action = this.translate.instant(actionKey);
    this.snackbar.open(message, action, {
      duration: 2000,
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  navigateTo(page: string): void {
    this.router.navigate([page]);
  }

  changePage(newPage: number): void {
    if (newPage < 0 || newPage >= this.totalPages) {
      return;
    }
    this.currentPage = newPage;
    this.updateDisplayedPets();
  }

  updateDisplayedPets(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedPets = this.pets.slice(startIndex, endIndex);
  }
}
