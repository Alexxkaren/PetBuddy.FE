import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let mockAuthService: { isAuthenticated$: BehaviorSubject<boolean> };
  let mockRouter: { navigate: jest.Mock };

  const mockRoute: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
  const mockState: RouterStateSnapshot = {} as RouterStateSnapshot;

  const executeGuard = (
    ...guardParameters: [ActivatedRouteSnapshot, RouterStateSnapshot]
  ) => TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    mockAuthService = {
      isAuthenticated$: new BehaviorSubject<boolean>(false),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if the user is authenticated', (done) => {
    mockAuthService.isAuthenticated$.next(true);

    const result = executeGuard(mockRoute, mockState);
    if (result instanceof Observable) {
      result.subscribe((res) => {
        expect(res).toBe(true);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      });
    } else if (result instanceof Promise) {
      result.then((res) => {
        expect(res).toBe(true);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      });
    } else {
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    }
  });

  it('should return false if the user is not authenticated', (done) => {
    mockAuthService.isAuthenticated$.next(false);

    const result = executeGuard(mockRoute, mockState);
    if (result instanceof Observable) {
      result.subscribe((res) => {
        expect(res).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/access-denied']);
        done();
      });
    } else if (result instanceof Promise) {
      result.then((res) => {
        expect(res).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/access-denied']);
        done();
      });
    } else {
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/access-denied']);
      done();
    }
  });
});
