import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { MentorshipService } from '@modules/mentorship/services/mentorship.service';
import { MentorshipStatusEnum } from '@core/enums/mentorship-status.enum';
import { map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { PATHS } from '@core/paths';

/**
 * Guard to ensure mentorship is active before accessing chat
 * Checks if the mentorship exists and is in an active state
 */
export const mentorshipActiveGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const authService = inject(AuthenticationService);
  const mentorshipService = inject(MentorshipService);
  const router = inject(Router);

  const mentorshipId = route.params['id'] || route.params['mentorshipId'];

  if (!mentorshipId) {
    router.navigate([PATHS.DISCOVER]);
    return of(false);
  }

  return authService.userData.pipe(
    take(1),
    switchMap((user) => {
      if (!user) {
        router.navigate([PATHS.AUTH__SIGN_IN]);
        return of(false);
      }

      return mentorshipService.getMentorshipById(mentorshipId).pipe(
        map((mentorship) => {
          const activeStatuses = [
            MentorshipStatusEnum.ACTIVE,
            MentorshipStatusEnum.COMPLETED_WAITING_REPORT,
            MentorshipStatusEnum.COMPLETED_WITH_REPORT,
          ];

          if (activeStatuses.includes(mentorship.status)) {
            return true;
          }

          router.navigate(['/dashboard/mentorships', mentorshipId]);
          return false;
        })
      );
    })
  );
};

