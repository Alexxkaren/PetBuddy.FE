import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, switchMap } from 'rxjs';

export const JwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  if (req.withCredentials) {
    return authService.idTokenClaims$.pipe(
      switchMap((idTokenClaims) => {
        if (idTokenClaims?.__raw) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${idTokenClaims.__raw}`,
            },
            withCredentials: false,
          });
        } else {
          req = req.clone({
            withCredentials: false,
          });
        }
        return next(req);
      }),
    );
  } else {
    return next(req);
  }
};
