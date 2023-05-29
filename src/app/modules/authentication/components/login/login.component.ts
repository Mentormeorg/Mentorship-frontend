import { Component, inject } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    private _authService: AuthenticationService = inject(AuthenticationService);
    email = '';
    password = '';
    signInWithGoogle() {
        this._authService.googleAuth();
    }
    signInWithLinkedin() {
        this._authService.linkedinAuth();
    }

    signInWithGithub() {
        this._authService.githubAuth();
    }
}
