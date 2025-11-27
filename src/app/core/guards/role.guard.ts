import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { RolesEnum } from '@core/enums/roles.enum';
import {
  redirectToPath,
  redirectToSignIn,
} from '@core/guards/utils/navigation.utils';
import { PATHS } from '@core/paths';
import { map, take } from 'rxjs/operators';

/**
 * Guard factory to protect routes based on user roles
 * @param allowedRoles - Array of roles that can access the route
 * @returns Guard function that checks if user has one of the allowed roles
 *
 * @example
 * // Allow only mentors
 * { path: 'mentor-dashboard', component: MentorDashboardComponent, canActivate: [roleGuard([RolesEnum.MENTOR])] }
 *
 * // Allow mentors and admins
 * { path: 'admin-panel', component: AdminPanelComponent, canActivate: [roleGuard([RolesEnum.MENTOR, RolesEnum.ADMIN])] }
 */
export function roleGuard(allowedRoles: RolesEnum[]): CanActivateFn {
	return (route, state) => {
		const authService = inject(AuthenticationService);
		const router = inject(Router);

		return authService.userData.pipe(
			take(1),
			map((user) => {
				// Check if user is authenticated
				if (!user) {
					redirectToSignIn(router);
					return false;
				}

				// Check if user has one of the allowed roles
				if (allowedRoles.includes(user.role)) {
					return true;
				}

				// User doesn't have required role - redirect based on their actual role
				// or to a default unauthorized page
				redirectToPath(router, PATHS.DISCOVER);
				return false;
			})
		);
	};
}

/**
 * Guard to protect routes that require mentor role
 */
export const mentorGuard: CanActivateFn = roleGuard([RolesEnum.MENTOR]);

/**
 * Guard to protect routes that require mentee role
 */
export const menteeGuard: CanActivateFn = roleGuard([RolesEnum.MENTEE]);

/**
 * Guard to protect routes that require admin role
 */
export const adminGuard: CanActivateFn = roleGuard([RolesEnum.ADMIN]);

/**
 * Guard to protect routes that require either mentor or admin role
 */
export const mentorOrAdminGuard: CanActivateFn = roleGuard([RolesEnum.MENTOR, RolesEnum.ADMIN]);

/**
 * Guard to protect routes that require either mentee or admin role
 */
export const menteeOrAdminGuard: CanActivateFn = roleGuard([RolesEnum.MENTEE, RolesEnum.ADMIN]);

