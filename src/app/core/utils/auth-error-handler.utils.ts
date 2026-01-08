import { Router } from '@angular/router';
import { SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { PATHS } from '@core/paths';
import { IUser } from '@core/interfaces/user.interface';
import { clearStorage } from './storage.utils';
import { ErrorHandlingService } from '@core/services/error-handling.service';

export interface HandleUserNotFoundParams {
  error: unknown;
  userData: BehaviorSubject<IUser | null>;
  isAuthenticated: BehaviorSubject<boolean>;
  supabaseClient: SupabaseClient;
  router: Router;
  errorHandlingService: ErrorHandlingService;
  customMessage?: string;
  customTitle?: string;
}

/**
 * Handle user_not_found errors by clearing session and redirecting
 */
export function handleUserNotFoundError(params: HandleUserNotFoundParams): boolean {
  const { error, userData, isAuthenticated, supabaseClient, router, errorHandlingService, customMessage, customTitle } = params;

  if (error && typeof error === 'object' && ('message' in error || 'code' in error)) {
    const errorObj = error as { message?: string; code?: string };
    if (errorObj.message?.includes('user_not_found') || errorObj.code === 'user_not_found') {
      userData.next(null);
      clearStorage();
      isAuthenticated.next(false);
      supabaseClient.auth.signOut().catch(() => {
        // Ignore signOut errors
      });
      errorHandlingService.handleError(
        customMessage || 'Your account was not found. Please sign up again.',
        customTitle || 'Account Not Found'
      );
      router.navigate([PATHS.AUTH__SIGN_IN]);
      return true;
    }
  }
  return false;
}
