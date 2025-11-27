import { inject, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProviderEnum } from '@core/enums';
import { RolesEnum } from '@core/enums/roles.enum';
import { StorageKeys } from '@core/enums/storage-keys.enum';
import {
  IForgetPasswordBody,
  ILoginBody,
  IRegisterBody,
  IResetPasswordBody,
} from '@core/interfaces/auth-bodies.interfaces';
import { IUser } from '@core/interfaces/user.interface';
import { IStepsData } from '@modules/registration-steps/models/interfaces/steps.interface';
import {
  clearStorage,
  getStorageItem,
  setStorage,
} from '@core/utils/storage.utils';
import { environment } from '@environments/environment';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PATHS } from '@core/paths';
import { ErrorHandlingService } from './error-handling.service';
import { AUTH_MESSAGES } from '@core/constants/auth-messages.constants';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements OnDestroy {
  public userData: BehaviorSubject<IUser | null> =
    new BehaviorSubject<IUser | null>(null);
  public isAuthenticated: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  private _router: Router = inject(Router);
  private _supabase: SupabaseService = inject(SupabaseService);
  private _errorHandlingService: ErrorHandlingService = inject(
    ErrorHandlingService
  );
  private _authInitialized = false;
  private _authStateChangeSubscription: ReturnType<
    typeof this._supabase.client.auth.onAuthStateChange
  > | null = null;
  //* Login user
  public login(user: ILoginBody) {
    return from(
      this._supabase.client.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      })
    ).pipe(
      map(response => {
        // Validate response and throw error if present
        this.validateResponse(response);

        if (response.data.user && response.data.session) {
          const mappedUser = this.mapSupabaseUserToIUser(
            response.data.user,
            response.data.session
          );
          this.setUserData(mappedUser);
          this.setToken(response.data.session.access_token);
          if (mappedUser) {
            this._errorHandlingService.showSuccess(
              AUTH_MESSAGES.SUCCESS.LOGIN,
              AUTH_MESSAGES.TITLES.LOGIN_SUCCESS
            );
            const nextRoute = this.getPostAuthenticationPath(mappedUser);
            this._router.navigate([nextRoute]);
          }
          return mappedUser;
        }
        return null;
      }),
      catchError(error => {
        // Use centralized error handling service
        this._errorHandlingService.handleError(
          error,
          AUTH_MESSAGES.ERROR.LOGIN_FAILED
        );
        return of(null);
      })
    );
  }
  //* Logout user
  public logout() {
    return from(this._supabase.client.auth.signOut()).pipe(
      map(() => {
        this.isAuthenticated.next(false);
        this.setUserData(null);
        clearStorage();
        this._router.navigate([PATHS.AUTH__SIGN_IN]);
        return true;
      }),
      catchError(error => {
        // Use centralized error handling service
        this._errorHandlingService.handleError(
          error,
          AUTH_MESSAGES.ERROR.LOGOUT_FAILED
        );
        // Still clear local state even if Supabase call fails
        this.isAuthenticated.next(false);
        this.setUserData(null);
        clearStorage();
        this._router.navigate([PATHS.AUTH__SIGN_IN]);
        return of(false);
      })
    );
  }
  //* Register user
  public register(user: IRegisterBody) {
    if (!user?.email || !user?.password) {
      this._errorHandlingService.handleError(
        AUTH_MESSAGES.ERROR.EMAIL_PASSWORD_REQUIRED,
        AUTH_MESSAGES.ERROR.REGISTRATION_FAILED
      );
      return of(false);
    }
    return from(
      this._supabase.client.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          emailRedirectTo: `${window.location.origin}/${PATHS.DISCOVER}`,
        },
      })
    ).pipe(
      map(response => {
        this.validateResponse(response);
        if (response.data) {
          this._errorHandlingService.showSuccess(
            AUTH_MESSAGES.SUCCESS.REGISTRATION,
            AUTH_MESSAGES.TITLES.REGISTRATION_SUCCESS
          );
          this._router.navigate([PATHS.AUTH__CHECK_EMAIL]);
        }
        return response.data;
      }),
      catchError(error => {
        this._errorHandlingService.handleError(
          error,
          AUTH_MESSAGES.ERROR.REGISTRATION_FAILED
        );
        return of(false);
      })
    );
  }
  //* Forget password
  public forgetPassword(forgetData: IForgetPasswordBody) {
    return from(
      this._supabase.client.auth.resetPasswordForEmail(
        forgetData.email,
        {
          redirectTo: `${window.location.origin}/${PATHS.AUTH__RESET_PASS}`,
        }
      )
    ).pipe(
      map(response => {
        this.validateResponse(response);
        if (response.data) {
          this._errorHandlingService.showSuccess(
            AUTH_MESSAGES.SUCCESS.PASSWORD_RESET_EMAIL,
            AUTH_MESSAGES.TITLES.EMAIL_SENT
          );
          this._router.navigate([PATHS.AUTH__CHECK_EMAIL]);
        }
        return response.data;
      }),
      catchError(error => {
        this._errorHandlingService.handleError(
          error,
          AUTH_MESSAGES.ERROR.PASSWORD_RESET_FAILED
        );
        return of(false);
      })
    );
  }
  //* Reset password
  public resetPassword(resetData: IResetPasswordBody) {
    return from(
      this._supabase.client.auth.updateUser(
        {
          password: resetData.newPassword,
        },
        {
          emailRedirectTo: `${window.location.origin}/${PATHS.AUTH__SIGN_IN}`,
        }
      )
    ).pipe(
      map(response => {
        this.validateResponse(response);
        if (response.data) {
          this._errorHandlingService.showSuccess(
            AUTH_MESSAGES.SUCCESS.PASSWORD_RESET,
            AUTH_MESSAGES.TITLES.PASSWORD_RESET_SUCCESS
          );
          this._router.navigate([PATHS.AUTH__CHECK_EMAIL]);
        }
        return response.data;
      }),
      catchError(error => {
        this._errorHandlingService.handleError(
          error,
          AUTH_MESSAGES.ERROR.PASSWORD_RESET_FAILED
        );
        return of(false);
      })
    );
  }
  //* Resend Verification Email
  public resendVerificationEmail(email: string) {
    return from(
      this._supabase.client.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: environment.supabase.redirectUrl,
        },
      })
    ).pipe(
      map(response => {
        this.validateResponse(response);
        if (response.data) {
          this._errorHandlingService.showSuccess(
            AUTH_MESSAGES.SUCCESS.VERIFICATION_EMAIL,
            AUTH_MESSAGES.TITLES.EMAIL_SENT
          );
        }
        return response.data;
      }),
      catchError(error => {
        // Use centralized error handling service
        this._errorHandlingService.handleError(
          error,
          AUTH_MESSAGES.ERROR.RESEND_VERIFICATION_FAILED
        );
        return of(false);
      })
    );
  }
  //* Social Auth
  public socialAuth(providers: AuthProviderEnum) {
    const providerMap: Partial<
      Record<AuthProviderEnum, 'google' | 'github' | 'linkedin'>
    > = {
      [AuthProviderEnum.GOOGLE]: 'google',
      [AuthProviderEnum.LINKEDIN]: 'linkedin',
      [AuthProviderEnum.GITHUB]: 'github',
    };
    const provider = providerMap[providers];
    if (!provider) {
      this._errorHandlingService.handleError(
        AUTH_MESSAGES.ERROR.INVALID_AUTH_PROVIDER,
        AUTH_MESSAGES.ERROR.SOCIAL_AUTH_FAILED
      );
      return of(false);
    }
    return from(
      this._supabase.client.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/${PATHS.DISCOVER}`,
        },
      })
    ).pipe(
      catchError(error => {
        this._errorHandlingService.handleError(
          error,
          AUTH_MESSAGES.ERROR.SOCIAL_AUTH_FAILED
        );
        return of(false);
      })
    );
  }
  //* Validate Supabase response and throw error if present [private]
  private validateResponse<T extends { error: unknown }>(
    response: T
  ): asserts response is T & { error: null } {
    if (response.error) {
      throw response.error;
    }
  }
  //* Set / Reset user data [private]
  private setUserData(userData: IUser | null): void {
    this.userData.next(userData);
    if (userData) {
      setStorage<IUser>(StorageKeys.USER_DATA, userData);
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
  //* Set token [private]
  private setToken(token: string): void {
    setStorage<string>(StorageKeys.TOKEN, token);
  }
  //* Determine the next route based on registration completion
  public getPostAuthenticationPath(
    userOverride?: IUser | null
  ): PATHS {
    const targetUser = userOverride ?? this.userData.value;
    if (!targetUser) {
      return PATHS.AUTH__SIGN_IN;
    }
    return targetUser.hasCompletedRegistration
      ? PATHS.DISCOVER
      : PATHS.AUTH__REG_STEPS__ROLE_INFO;
  }
  //* Map Supabase user to IUser [private]
  private mapSupabaseUserToIUser(
    supabaseUser: {
      id: string;
      email?: string;
      user_metadata?: Record<string, unknown>;
      email_confirmed_at?: string | null;
      phone?: string;
      created_at?: string;
    },
    session: { access_token: string; refresh_token?: string | null },
    isOAuth = false
  ): IUser {
    return {
      id: supabaseUser.id, // Use string UUID directly, no parsing
      email: supabaseUser.email || '',
      fullName:
        (supabaseUser.user_metadata?.['full_name'] as string) ||
        supabaseUser.email?.split('@')[0] ||
        '',
      isOAuth,
      isVerified: !!supabaseUser.email_confirmed_at,
      role: ((supabaseUser.user_metadata?.['role'] as string) ||
        RolesEnum.MENTEE) as RolesEnum,
      phoneNumber: supabaseUser.phone || '',
      createdAt: supabaseUser.created_at || '',
      accessToken: session.access_token,
      refreshToken: session.refresh_token || '',
      hasCompletedRegistration: Boolean(
        supabaseUser.user_metadata?.['registrationCompleted']
      ),
      registrationData: supabaseUser.user_metadata?.['registrationData'] as IStepsData['stepsData'][] | undefined,
    };
  }
  //* Mark user registration as complete (mentor onboarding)
  public markRegistrationComplete(registrationData?: IStepsData['stepsData'][]) {
    const currentUser = this.userData.value;

    if (!currentUser) {
      this._errorHandlingService.handleError(
        AUTH_MESSAGES.ERROR.SIGN_IN_REQUIRED,
        AUTH_MESSAGES.ERROR.REGISTRATION_COMPLETE_FAILED
      );
      return of(false);
    }

    return from(
      this._supabase.client.auth.updateUser({
        data: {
          registrationCompleted: true,
          registrationData: registrationData || null,
        },
      })
    ).pipe(
      map(response => {
        this.validateResponse(response);
        const sessionTokens = {
          access_token: currentUser.accessToken,
          refresh_token: currentUser.refreshToken,
        };
        if (response.data.user) {
          const updatedUser = this.mapSupabaseUserToIUser(
            response.data.user,
            sessionTokens,
            currentUser.isOAuth
          );
          this.setUserData({
            ...updatedUser,
            hasCompletedRegistration: true,
            registrationData: registrationData || undefined,
          });
        } else {
          this.setUserData({
            ...currentUser,
            hasCompletedRegistration: true,
            registrationData: registrationData || undefined,
          });
        }
        this._errorHandlingService.showSuccess(
          AUTH_MESSAGES.SUCCESS.REGISTRATION_COMPLETE,
          AUTH_MESSAGES.TITLES.ONBOARDING_COMPLETE
        );
        return true;
      }),
      catchError(error => {
        this._errorHandlingService.handleError(
          error,
          AUTH_MESSAGES.ERROR.REGISTRATION_COMPLETE_FAILED
        );
        return of(false);
      })
    );
  }
  //* Initialize auth state on app startup
  public initializeAuth(): void {
    // Prevent multiple initializations
    if (this._authInitialized) {
      return;
    }
    this._authInitialized = true;

    // Try to restore user from localStorage first
    const storedUser = getStorageItem<IUser>(StorageKeys.USER_DATA);
    if (storedUser) {
      this.setUserData(storedUser);
    }

    // Get current session with error handling
    from(this._supabase.client.auth.getSession())
      .pipe(
        map(response => {
          this.validateResponse(response);
          const session = response.data.session;
          if (session) {
            const mappedUser = this.mapSupabaseUserToIUser(
              session.user,
              session
            );
            this.setUserData(mappedUser);
            this.setToken(session.access_token);
          } else if (!storedUser) {
            // No session and no stored user - clear state
            this.setUserData(null);
          }
          return session;
        }),
        catchError(error => {
          // Silently handle lock errors - they're often non-critical
          if (error?.name !== 'NavigatorLockAcquireTimeoutError') {
            this._errorHandlingService.handleError(
              error,
              AUTH_MESSAGES.ERROR.AUTH_INITIALIZATION_FAILED
            );
          }
          return of(null);
        })
      )
      .subscribe();

    // Set up auth state change listener with proper cleanup
    this._authStateChangeSubscription =
      this._supabase.client.auth.onAuthStateChange(
        (event: AuthChangeEvent, session: Session | null) => {
          this.handleAuthStateChange(event, session);
        }
      );
  }
  //* Handle auth state changes
  private handleAuthStateChange(
    event: AuthChangeEvent,
    session: Session | null
  ): void {
    switch (event) {
      case 'SIGNED_OUT':
        this.isAuthenticated.next(false);
        this.setUserData(null);
        clearStorage();
        break;
      case 'SIGNED_IN':
        if (session) {
          const mappedUser = this.mapSupabaseUserToIUser(
            session.user,
            session
          );
          this.setUserData(mappedUser);
          this.setToken(session.access_token);

          // Navigate to appropriate page after OAuth sign-in
          const nextRoute =
            this.getPostAuthenticationPath(mappedUser);
          this._router.navigate([nextRoute]);
        }
        break;
      case 'TOKEN_REFRESHED':
        if (session) {
          const mappedUser = this.mapSupabaseUserToIUser(
            session.user,
            session
          );
          this.setUserData(mappedUser);
          this.setToken(session.access_token);
        }
        break;
      case 'USER_UPDATED':
        if (session) {
          const mappedUser = this.mapSupabaseUserToIUser(
            session.user,
            session
          );
          this.setUserData(mappedUser);
        }
        break;
    }
  }
  //* Check if user has a specific role
  public hasRole(role: RolesEnum): boolean {
    const user = this.userData.value;
    return user?.role === role;
  }
  //* Check if user has any of the specified roles
  public hasAnyRole(roles: RolesEnum[]): boolean {
    const user = this.userData.value;
    if (!user) return false;
    return roles.includes(user.role);
  }
  //* Check if user is a mentor
  public isMentor(): boolean {
    return this.hasRole(RolesEnum.MENTOR);
  }
  //* Check if user is a mentee
  public isMentee(): boolean {
    return this.hasRole(RolesEnum.MENTEE);
  }
  //* Check if user is an admin
  public isAdmin(): boolean {
    return this.hasRole(RolesEnum.ADMIN);
  }
  //* Get current user role
  public getCurrentRole(): RolesEnum | null {
    return this.userData.value?.role || null;
  }
  //* Cleanup on service destruction
  ngOnDestroy(): void {
    if (this._authStateChangeSubscription?.data?.subscription) {
      this._authStateChangeSubscription.data.subscription.unsubscribe();
    }
  }
}
