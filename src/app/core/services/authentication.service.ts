import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProviderEnum } from '@core/enums';
import { StorageKeys } from '@core/enums/storage-keys.enum';
import {
    IForgetPasswordBody,
    ILoginBody,
    IRegisterBody,
    IResetPasswordBody,
} from '@core/interfaces/auth-bodies.interfaces';
import { IRES } from '@core/interfaces/http-res.interface';
import { IUser } from '@core/interfaces/user.interface';
import {
    clearStorage,
    getStorageItem,
    setStorage,
} from '@core/utils/storage.utils';
import { environment } from '@environments/environment';
import { BehaviorSubject, catchError, map, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private readonly BASE_URL = environment.baseUrl;

    private _http: HttpClient = inject(HttpClient);
    private _router: Router = inject(Router);
    private _ngZone: NgZone = inject(NgZone);

    private readonly GOOGLE_AUTH_URL = `${this.BASE_URL}/auth/google`;
    private readonly LINKEDIN_AUTH_URL = `${this.BASE_URL}/auth/linkedin`;
    private readonly GITHUB_AUTH_URL = `${this.BASE_URL}/auth/github`;

    private readonly LOGIN_URL = `${this.BASE_URL}/auth/sign-in`;
    private readonly LOGOUT_URL = `${this.BASE_URL}/auth/logout`;
    private readonly REGISTER_URL = `${this.BASE_URL}/auth/sign-up`;

    private readonly FORGET_PASSWORD_URL = `${this.BASE_URL}/auth/forget-password`;
    private readonly RESET_PASSWORD_URL = `${this.BASE_URL}/auth/reset-credentials`;
    private readonly ACTIVE_ACCOUNT_URL = `${this.BASE_URL}/auth/activate`;
    private readonly RESEND_ACTIVATION_URL = `${this.BASE_URL}/auth/resend-verification`;
    private readonly REFRESH_TOKEN_URL = `${this.BASE_URL}/auth/refresh-token`;

    public userData: BehaviorSubject<IUser | null> =
        new BehaviorSubject<IUser | null>(null);

    public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(
        false
    );

    public setOAuthToken(token: string) {
        if (
            token === null ||
            token === '' ||
            token === undefined ||
            token === 'null' ||
            token === 'undefined'
        ) {
            return;
        }
        setStorage<string>(StorageKeys.OAUTH_TOKEN, token);
    }

    public getOAuthToken(): string {
        return getStorageItem<string>(StorageKeys.OAUTH_TOKEN);
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

    //* Login user
    public login(user: ILoginBody): void {
        // * Send login request to server
        this._http
            .post<IRES<IUser>>(this.LOGIN_URL, user)
            // * Handle response
            .pipe(
                map((res: IRES<IUser>) => {
                    // * if login is successful, set user data and return true
                    if (res.success) {
                        this.setUserData(res.data);
                        this.isAuthenticated.next(true);
                        this.setToken(res.data.accessToken);
                        return true;
                    } else {
                        // * else return false
                        return false;
                    }
                }),
                catchError((e) => {
                    return of(e);
                })
            );
    }

    //* Logout user
    public logout() {
        // * if logout is successful, set user data to null and return true
        // * else return false
        return this._http.get(this.LOGOUT_URL).pipe(
            map(() => {
                this.isAuthenticated.next(false);
                this.setUserData(null);
                clearStorage();
            }),
            catchError((e) => {
                return of(e);
            })
        );
    }

    //* Register user
    public register(user: IRegisterBody): void {
        // * Send register request to server

        this._http.post<IRES<IUser>>(this.REGISTER_URL, user).pipe(
            // map((res) => {

            // }),
            catchError((e) => {
                return of(e);
            })
        );
    }

    //* Forget password
    public forgetPassword(forgetData: IForgetPasswordBody): void {
        this._http.post(this.FORGET_PASSWORD_URL, forgetData).pipe(
            catchError((e) => {
                return of(e);
            })
        );
    }

    //* reset password
    public resetPassword(resetData: IResetPasswordBody): void {
        resetData.token = getStorageItem(StorageKeys.TOKEN) as string;
        this._http.post(this.RESET_PASSWORD_URL, resetData);
    }

    //* Activate account
    public activateAccount(): void {
        const token = getStorageItem(StorageKeys.TOKEN) as string;
        this._http.get(`${this.ACTIVE_ACCOUNT_URL}`, {
            params: {
                token,
            },
        });
    }

    //* resend Verification Email
    public resendVerificationEmail(email: string): void {
        this._http.post(this.RESEND_ACTIVATION_URL, { email }).pipe(
            catchError((e) => {
                return of(e);
            })
        );
    }

    //* Handle refresh token
    public handleRefreshToken(): void {
        const refreshToken = this.userData.value?.refreshToken;
        this._http
            .post(this.REFRESH_TOKEN_URL, {
                refreshToken,
            })
            .pipe(
                // ! Replace [ ANY ]  with the response type
                map((res) => {
                    if (res) {
                        // this.setToken(res.accessToken);
                    }
                }),
                catchError((e) => {
                    return of(e);
                })
            );
    }

    public socialAuth(providers: AuthProviderEnum): void {
        let authURL = '';
        const popupWidth = 600;
        const popupHeight = 600;
        switch (providers) {
            case AuthProviderEnum.GOOGLE:
                authURL = this.GOOGLE_AUTH_URL;
                break;
            case AuthProviderEnum.LINKEDIN:
                authURL = this.LINKEDIN_AUTH_URL;
                break;
            case AuthProviderEnum.GITHUB:
                authURL = this.GITHUB_AUTH_URL;
                break;
        }
        window.open(
            authURL,
            'popup',
            `width=${popupWidth},height=${popupHeight}`
        );
    }

    public authenticationWindowBinder(authType: 'signIn' | 'signup') {
        const signUpRedirect = '/auth/registeration-steps';
        const signInRedirect = '/';

        const redirectLink =
            authType === 'signIn' ? signInRedirect : signUpRedirect;
        if (Object.keys(this.getOAuthToken()).length) {
            this.isAuthenticated.next(true);
        } else {
            this._ngZone.runOutsideAngular(() => {
                window.addEventListener(
                    'storage',
                    (e: StorageEvent): void => {
                        if (e.storageArea?.getItem(StorageKeys.OAUTH_TOKEN)) {
                            this._ngZone.run(() => {
                                this.isAuthenticated.next(true);
                                this._router.navigate([redirectLink]);
                            });
                        }
                    },
                    { once: true }
                );
            });
        }
    }
}
