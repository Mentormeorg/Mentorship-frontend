import { Router } from '@angular/router';
import { SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { PATHS } from '@core/paths';
import { IUser } from '@core/interfaces/user.interface';
import { clearStorage } from './storage.utils';
import { mapSupabaseUserToIUser } from './user-mapper.utils';
import { syncOAuthUserProfile } from './oauth-profile-sync.utils';
import { handleUserNotFoundError } from './auth-error-handler.utils';
import type { Session } from '@supabase/supabase-js';

export interface HandleSignedInParams {
  session: Session;
  userData: BehaviorSubject<IUser | null>;
  isAuthenticated: BehaviorSubject<boolean>;
  supabaseClient: SupabaseClient;
  router: Router;
  errorHandlingService: any;
  setUserData: (user: IUser | null) => void;
  setToken: (token: string) => void;
  getPostAuthenticationPath: (user?: IUser | null) => PATHS;
}

/**
 * Handle SIGNED_IN auth state change event
 */
export function handleSignedInEvent(params: HandleSignedInParams): void {
  const {
    session,
    userData,
    isAuthenticated,
    supabaseClient,
    router,
    errorHandlingService,
    setUserData,
    setToken,
    getPostAuthenticationPath,
  } = params;

  try {
    // Detect if this is an OAuth user by checking app_metadata or user_metadata
    const isOAuth = !!(session.user.app_metadata?.provider &&
      session.user.app_metadata.provider !== 'email');

    const mappedUser = mapSupabaseUserToIUser(
      session.user,
      session,
      isOAuth
    );
    setUserData(mappedUser);
    setToken(session.access_token);

    // Sync OAuth user profile to profiles_table if needed
    if (isOAuth) {
      syncOAuthUserProfile(supabaseClient, session.user).subscribe();
    }

    // Navigate to appropriate page after OAuth sign-in
    // Use setTimeout to ensure state is fully updated before navigation
    setTimeout(() => {
      const nextRoute = getPostAuthenticationPath(mappedUser);
      router.navigate([nextRoute]);
    }, 0);
  } catch (error) {
    // If user mapping fails (e.g., user_not_found), logout
    handleUserNotFoundError({
      error,
      userData,
      isAuthenticated,
      supabaseClient,
      router,
      errorHandlingService,
    });
  }
}

export interface HandleTokenRefreshedParams {
  session: Session;
  userData: BehaviorSubject<IUser | null>;
  isAuthenticated: BehaviorSubject<boolean>;
  supabaseClient: SupabaseClient;
  router: Router;
  errorHandlingService: any;
  setUserData: (user: IUser | null) => void;
  setToken: (token: string) => void;
}

/**
 * Handle TOKEN_REFRESHED auth state change event
 */
export function handleTokenRefreshedEvent(params: HandleTokenRefreshedParams): void {
  const {
    session,
    userData,
    isAuthenticated,
    supabaseClient,
    router,
    errorHandlingService,
    setUserData,
    setToken,
  } = params;

  try {
    const mappedUser = mapSupabaseUserToIUser(
      session.user,
      session
    );
    setUserData(mappedUser);
    setToken(session.access_token);
  } catch (error) {
    handleUserNotFoundError({
      error,
      userData,
      isAuthenticated,
      supabaseClient,
      router,
      errorHandlingService,
    });
  }
}

export interface HandleUserUpdatedParams {
  session: Session;
  userData: BehaviorSubject<IUser | null>;
  isAuthenticated: BehaviorSubject<boolean>;
  supabaseClient: SupabaseClient;
  router: Router;
  errorHandlingService: any;
  setUserData: (user: IUser | null) => void;
}

/**
 * Handle USER_UPDATED auth state change event
 */
export function handleUserUpdatedEvent(params: HandleUserUpdatedParams): void {
  const {
    session,
    userData,
    isAuthenticated,
    supabaseClient,
    router,
    errorHandlingService,
    setUserData,
  } = params;

  try {
    const mappedUser = mapSupabaseUserToIUser(
      session.user,
      session
    );
    setUserData(mappedUser);
  } catch (error) {
    handleUserNotFoundError({
      error,
      userData,
      isAuthenticated,
      supabaseClient,
      router,
      errorHandlingService,
    });
  }
}
