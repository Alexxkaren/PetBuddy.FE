import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class BaseDataService {
  private readonly http: HttpClient;
  private readonly baseUrl: string | null;

  protected constructor(private readonly controller: string | null) {
    this.http = inject(HttpClient);

    this.baseUrl =
      this.controller === null
        ? environment.apiUrl
        : `${environment.apiUrl}/${this.controller}`;
  }

  getDataFromEndpoint<T>(
    endpoint: string | undefined = undefined,
    params?:
      | HttpParams
      | Record<
          string,
          string | number | boolean | readonly (string | number | boolean)[]
        >,
  ): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, { withCredentials: true, params })
      .pipe(shareReplay(1));
  }

  postDataToEndpoint<T>(
    endpoint: string | undefined = undefined,
    data: unknown,
    params?:
      | HttpParams
      | Record<
          string,
          string | number | boolean | readonly (string | number | boolean)[]
        >,
  ): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, data, {
        withCredentials: true,
        params,
      })
      .pipe(shareReplay(1));
  }

  putDataAtEndpoint<T>(
    endpoint: string | undefined = undefined,
    data: unknown,
    params?:
      | HttpParams
      | Record<
          string,
          string | number | boolean | readonly (string | number | boolean)[]
        >,
  ): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, data, {
        withCredentials: true,
        params,
      })
      .pipe(shareReplay(1));
  }

  deleteDataFromEndpoint<T>(
    endpoint: string | undefined = undefined,
    params?:
      | HttpParams
      | Record<
          string,
          string | number | boolean | readonly (string | number | boolean)[]
        >,
  ): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`, {
        withCredentials: true,
        params,
      })
      .pipe(shareReplay(1));
  }
}
