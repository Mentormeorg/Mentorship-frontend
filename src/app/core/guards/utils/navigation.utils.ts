import { Router } from '@angular/router';
import { PATHS } from '@core/paths';

export function redirectToSignIn(router: Router): void {
  router.navigate([PATHS.AUTH__SIGN_IN]);
}

export function redirectToRegistrationSteps(router: Router): void {
  router.navigate([PATHS.AUTH__REG_STEPS__ROLE_INFO]);
}

export function redirectToPath(router: Router, path: string): void {
  router.navigate([path]);
}

