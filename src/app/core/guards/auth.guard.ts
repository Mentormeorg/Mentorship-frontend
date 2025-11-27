import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { redirectToSignIn } from '@core/guards/utils/navigation.utils';
import { map, take } from 'rxjs/operators';

/**
 * Guard to protect routes that require authentication
 * Redirects to sign-in if user is not authenticated
 */
export const authGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthenticationService);
	const router = inject(Router);

	return authService.isAuthenticated.pipe(
		take(1),
		map((isAuthenticated) => {
			if (isAuthenticated) {
				return true;
			}
			redirectToSignIn(router);
			return false;
		})
	);
};

