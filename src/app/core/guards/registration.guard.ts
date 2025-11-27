import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RolesEnum } from '@core/enums/roles.enum';
import { AuthenticationService } from '@core/services/authentication.service';
import {
  redirectToRegistrationSteps,
  redirectToSignIn,
  redirectToPath,
} from '@core/guards/utils/navigation.utils';
import { map, take } from 'rxjs/operators';

/**
 * Guard ensures mentors finish onboarding before accessing protected pages.
 * Use route data `registrationRequiredForRoles` to override default roles.
 */
export const registrationCompletionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const requiredRoles =
    (route.data?.['registrationRequiredForRoles'] as RolesEnum[]) || [
      RolesEnum.MENTEE,
      RolesEnum.MENTOR,
    ];

  return authService.userData.pipe(
    take(1),
    map(user => {
      if (!user) {
        redirectToSignIn(router);
        return false;
      }

      const shouldForceCompletion = requiredRoles.includes(user.role);

      if (shouldForceCompletion && !user.hasCompletedRegistration) {
        redirectToRegistrationSteps(router);
        return false;
      }

      return true;
    })
  );
};

/**
 * Guard prevents users who already finished onboarding from re-entering the registration wizard.
 * Redirects them to the dashboard (or sign-in if not authenticated).
 */
export const registrationAccessGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  return authService.userData.pipe(
    take(1),
    map(user => {
      if (!user) {
        redirectToSignIn(router);
        return false;
      }

      if (user.hasCompletedRegistration) {
        const nextPath = authService.getPostAuthenticationPath(user);
        redirectToPath(router, nextPath);
        return false;
      }

      return true;
    })
  );
};

