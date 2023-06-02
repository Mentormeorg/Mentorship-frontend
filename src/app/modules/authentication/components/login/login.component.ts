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
    public isAuthenticated = this.authService.isAuthenticated;

    ngOnInit(): void {
        this.authService.isAuthenticated.subscribe((status) => {
            console.log(status);
            if (status) {
                this._router.navigate(['/']);
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
                this.isAuthenticated.subscribe(console.log);
                break;
            default:
                throw new Error(`Invalid provider: ${provider}`);
        }
    }
}
