import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { map, take } from 'rxjs/operators';

/**
 * Guard to protect routes that should only be accessible to unauthenticated users
 * Redirects authenticated users away from auth pages (sign-in, sign-up, etc.)
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  return authService.isAuthenticated.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        return true;
      }

      const nextRoute = authService.getPostAuthenticationPath(
        authService.userData.value
      );

      router.navigate([nextRoute], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    })
  );
};

