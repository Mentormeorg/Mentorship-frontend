import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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
    private _http: HttpClient = inject(HttpClient);
    private readonly BASE_URL = environment.baseUrl;
    private readonly LOGIN_URL = `${this.BASE_URL}/auth/sign-in`;
    private readonly LOGOUT_URL = `${this.BASE_URL}/auth/logout`;
    private readonly GOOGLE_AUTH_URL = `${this.BASE_URL}/auth/google`;
    private readonly LINKEDIN_AUTH_URL = `${this.BASE_URL}/auth/linkedin`;
    private readonly GITHUB_AUTH_URL = `${this.BASE_URL}/auth/github`;

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

    //* Set / Reset user data [private]
    private setUserData(userData: IUser | null): void {
        this.userData.next(userData);
        setStorage<IUser | null>(StorageKeys.USER_DATA, userData);
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
        console.log('object');
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

    public googleAuth(): void {
        window.open(
            this.GOOGLE_AUTH_URL,
            'mozillaWindow',
            'popup,resizable=1,width=350,height=250'
        );
    }
    public linkedinAuth(): void {
        window.open(
            this.LINKEDIN_AUTH_URL,
            'mozillaWindow',
            'popup,resizable=1,width=350,height=250'
        );
    }
    public githubAuth(): void {
        window.open(
            this.GITHUB_AUTH_URL,
            'mozillaWindow',
            'popup,resizable=1,width=350,height=250'
        );
    }
}
