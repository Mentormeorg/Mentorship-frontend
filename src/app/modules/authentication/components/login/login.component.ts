import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    private _router: Router = inject(Router);
    public authService: AuthenticationService = inject(AuthenticationService);
    public email = '';
    public password = '';
    public isAuthenticated = this.authService.isAuthOk();

    ngOnInit(): void {
        if (
            this.authService.getOAuthToken() !== null &&
            this.authService.getOAuthToken() !== undefined &&
            this.authService.getOAuthToken() !== ''
        ) {
            this._router.navigate(['auth/registeration-steps']);
        }
    }
    signIn(provider: string) {
        switch (provider) {
            case 'google':
                this.authService.googleAuth();
                break;
            case 'linkedin':
                this.authService.linkedinAuth();
                break;
            case 'github':
                this.authService.githubAuth();
                break;
            case 'email':
                this.isAuthenticated.subscribe(console.log);
                break;
            default:
                throw new Error(`Invalid provider: ${provider}`);
        }
    }
}
