import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    public authService: AuthenticationService = inject(AuthenticationService);
    private _router: Router = inject(Router);
    email = '';
    password = '';

    ngOnInit(): void {
        this.authService.isAuthOk().subscribe((authenticated: boolean) => {
            if (authenticated) {
                this._router.navigate(['/registeration-steps']);
            }
        });
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
                this.authService.isAuthenticated.next(true);
                break;
            default:
                throw new Error(`Invalid provider: ${provider}`);
        }
    }
}
