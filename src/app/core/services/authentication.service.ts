import { inject, Injectable, NgZone } from '@angular/core';
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
import {
	clearStorage,
	getStorageItem,
	setStorage,
} from '@core/utils/storage.utils';
import { environment } from '@environments/environment';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	public userData: BehaviorSubject<IUser | null> =
		new BehaviorSubject<IUser | null>(null);
	public isAuthenticated: BehaviorSubject<boolean> =
		new BehaviorSubject(false);
	private _router: Router = inject(Router);
	private _ngZone: NgZone = inject(NgZone);
	private _supabase: SupabaseService = inject(SupabaseService);

	public setOAuthToken(token: string) {
		if (
			!token || token === 'null' || token === 'undefined'
		) {
			return;
		}
		setStorage<string>(StorageKeys.OAUTH_TOKEN, token);
	}

	public getOAuthToken(): string {
		return getStorageItem<string>(StorageKeys.OAUTH_TOKEN);
	}

	//* Login user
	public login(user: ILoginBody) {
		return from(
			this._supabase.client.auth.signInWithPassword({
				email: user.email,
				password: user.password,
			})
		).pipe(
			map(response => {
				if (response.data.user && response.data.session) {
					const mappedUser = this.mapSupabaseUserToIUser(
						response.data.user,
						response.data.session
					);
					this.setUserData(mappedUser);
					this.setToken(response.data.session.access_token);
					return true;
				}
				return false;
			}),
			catchError(() => {
				return of(false);
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
				return true;
			}),
			catchError(error => {
				console.error('Logout error:', error);
				// Still clear local state even if Supabase call fails
				this.isAuthenticated.next(false);
				this.setUserData(null);
				clearStorage();
				return of(false);
			})
		);
	}

	//* Register user
	public register(user: IRegisterBody) {
		return from(
			this._supabase.client.auth.signUp({
				email: user.email,
				password: user.password,
				options: {
					data: {
						full_name: user.fullName || user.email?.split('@')[0],
						phone_number: user.phoneNumber || '',
					},
				},
			})
		).pipe(
			map(response => {
				if (response.data.user) {
					// User registered, but email verification may be required
					return true;
				}
				return false;
			}),
			catchError(error => {
				console.error('Register error:', error);
				return of(false);
			})
		);
	}

	//* Forget password
	public forgetPassword(forgetData: IForgetPasswordBody) {
		return from(
			this._supabase.client.auth.resetPasswordForEmail(forgetData.email, {
				redirectTo: `${environment.supabase.redirectUrl}?type=recovery`,
			})
		).pipe(
			map(() => true),
			catchError(error => {
				console.error('Forget password error:', error);
				return of(false);
			})
		);
	}

	//* reset password
	public resetPassword(resetData: IResetPasswordBody) {
		return from(
			this._supabase.client.auth.updateUser({
				password: resetData.newPassword,
			})
		).pipe(
			map(() => true),
			catchError(error => {
				console.error('Reset password error:', error);
				return of(false);
			})
		);
	}

	//* Activate account (Supabase handles this via email link)
	public activateAccount(): void {
		// Supabase handles email verification automatically via email link
		// This method can check if user is verified
		this._supabase.client.auth.getUser().then(response => {
			if (response.data.user?.email_confirmed_at) {
				// User is verified
				const user = this.userData.value;
				if (user) {
					user.isVerified = true;
					this.setUserData(user);
				}
			}
		});
	}

	//* resend Verification Email
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
			map(() => true),
			catchError(error => {
				console.error('Resend verification error:', error);
				return of(false);
			})
		);
	}

	//* Handle refresh token (Supabase handles this automatically)
	public handleRefreshToken() {
		return from(this._supabase.client.auth.refreshSession()).pipe(
			map(response => {
				if (response.data.session) {
					const session = response.data.session;
					this.setToken(session.access_token);

					// Update user data with new tokens
					const user = this.userData.value;
					if (user) {
						user.accessToken = session.access_token;
						user.refreshToken = session.refresh_token || '';
						this.setUserData(user);
					}
					return true;
				}
				return false;
			}),
			catchError(error => {
				console.error('Refresh token error:', error);
				return of(false);
			})
		);
	}

	public socialAuth(providers: AuthProviderEnum) {

		let provider: 'google' | 'github' | 'linkedin' | null = null;

		switch (providers) {
			case AuthProviderEnum.GOOGLE:
				provider = 'google';
				break;
			case AuthProviderEnum.LINKEDIN:
				provider = 'linkedin';
				break;
			case AuthProviderEnum.GITHUB:
				provider = 'github';
				break;
		}

		if (!provider) {
			return;
		}

		return from(
			this._supabase.client.auth.signInWithOAuth({
				provider: provider,
				options: {
					redirectTo: environment.supabase.redirectUrl,
				},
			})
		).pipe(
			map(response => {
				console.log(response)
				if (response.data.url) {
					// Open OAuth popup
					return true;
				}
				return false;
			}),
			catchError(error => {
				console.error('Social auth error:', error);
				return of(false);
			})
		);
	}

	public authenticationWindowBinder(authType: 'signIn' | 'signup') {
		const signUpRedirect = '/auth/registeration-steps';
		const signInRedirect = '/';

		const redirectLink =
			authType === 'signIn' ? signInRedirect : signUpRedirect;

		// Listen for Supabase auth state changes (OAuth callback)
		this._supabase.client.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_IN' && session) {
				this._ngZone.run(() => {
					const mappedUser = this.mapSupabaseUserToIUser(session.user, session, true);
					this.setUserData(mappedUser);
					this.setToken(session.access_token);
					this._router.navigate([redirectLink]);
				});
			}
		});
	}

	//* Set / Reset user data [private]
	private setUserData(userData: IUser | null): void {
		this.userData.next(userData);
		setStorage<IUser | null>(StorageKeys.USER_DATA, userData);
		this.isAuthenticated.next(true);
	}

	//* set token [private]
	private setToken(token: string): void {
		setStorage<string>(StorageKeys.TOKEN, token);
	}

	//* Map Supabase user to IUser [private]
	private mapSupabaseUserToIUser(
		supabaseUser: { id: string; email?: string; user_metadata?: Record<string, unknown>; email_confirmed_at?: string | null; phone?: string; created_at?: string },
		session: { access_token: string; refresh_token?: string | null },
		isOAuth = false
	): IUser {
		return {
			id: parseInt(supabaseUser.id) || 0,
			email: supabaseUser.email || '',
			fullName: supabaseUser.user_metadata?.['full_name'] as string || supabaseUser.email?.split('@')[0] || '',
			isOAuth,
			isVerified: !!supabaseUser.email_confirmed_at,
			role: (supabaseUser.user_metadata?.['role'] as string || 'user') as RolesEnum,
			phoneNumber: supabaseUser.phone || '',
			createdAt: supabaseUser.created_at || '',
			accessToken: session.access_token,
			refreshToken: session.refresh_token || '',
		};
	}

	//* Initialize auth state on app startup
	public initializeAuth(): void {
		this._supabase.client.auth.getSession().then(response => {

			if (response.data.session) {
				const mappedUser = this.mapSupabaseUserToIUser(
					response.data.session.user,
					response.data.session
				);
				this.setUserData(mappedUser);
				this.setToken(response.data.session.access_token);
			}
		});

		this._supabase.client.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_OUT') {
				this.isAuthenticated.next(false);
				this.setUserData(null);
				clearStorage();
			} else if (event === 'SIGNED_IN' && session) {
				const mappedUser = this.mapSupabaseUserToIUser(session.user, session);
				this.setUserData(mappedUser);
				this.setToken(session.access_token);
			}
		});

	}
}
