import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { PetService } from '../../../services/pet-data/pet-data.service';
import { MyPetsPageComponent } from './mypets-page.component';

describe('MyPetsPageComponent', () => {
  let component: MyPetsPageComponent;
  let fixture: ComponentFixture<MyPetsPageComponent>;

  beforeEach(async () => {
    const petServiceMock = {
      getPetsProfilesByUser: jest.fn().mockReturnValue(of([])),
      deletePetById: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<PetService>;

    await TestBed.configureTestingModule({
      imports: [
        MyPetsPageComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        { provide: PetService, useValue: petServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyPetsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to page', () => {
    const router = TestBed.inject(Router);
    const spy = jest.spyOn(router, 'navigate');
    component.navigateTo('page');
    expect(spy).toHaveBeenCalled();
  });

  it('should change page', () => {
    component.totalPages = 3;
    component.changePage(2);
    expect(component.currentPage).toBe(2);
  });

  it('should delete pet', () => {
    const petService = TestBed.inject(PetService);
    const spy = jest.spyOn(petService, 'deletePetById');
    component.onPetDeleted(Guid.create());
    expect(spy).toHaveBeenCalled();
  });
});
