import { Component, OnChanges, SimpleChanges, inject } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnChanges {
    public authService: AuthenticationService = inject(AuthenticationService);
    email = '';
    password = '';

    constructor() {
        this.authService.isAuthOk();
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
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
