import { Routes } from '@angular/router';
import { MainPageComponent } from './components/pages/main-page/main-page.component';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';
import { MyPetsPageComponent } from './components/pages/mypets-page/mypets-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { AddAnimalPageComponent } from './components/pages/add-animal-page/add-animal-page.component';
import { PetSearchPageComponent } from './components/pages/pet-search-page/pet-search-page.component';
import { authGuard } from './core/guard/auth.guard';
import { ErrorPagesComponent } from './components/pages/error-pages/error-pages.component';
import { PetOverviewPageComponent } from './components/pages/pet-overview-page/pet-overview-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    pathMatch: 'full',
    component: MainPageComponent,
  },
  {
    path: 'profile',
    pathMatch: 'full',
    canActivate: [authGuard],
    component: ProfilePageComponent,
  },
  {
    path: 'mypets',
    pathMatch: 'full',
    canActivate: [authGuard],
    component: MyPetsPageComponent,
  },
  {
    path: 'register',
    pathMatch: 'full',
    component: RegisterPageComponent,
  },
  {
    path: 'add-animal',
    pathMatch: 'full',
    canActivate: [authGuard],
    component: AddAnimalPageComponent,
  },
  {
    path: 'pet-search',
    pathMatch: 'full',
    component: PetSearchPageComponent,
  },
  {
    path: 'pet-overview',
    pathMatch: 'full',
    component: PetOverviewPageComponent,
  },
  {
    path: 'access-denied',
    pathMatch: 'full',
    component: ErrorPagesComponent,
    data: { ErrorPageType: 'AccessDenied' },
  },
  {
    path: '**',
    component: ErrorPagesComponent,
    data: { ErrorPageType: 'ErrorNotFound' },
  },
];
