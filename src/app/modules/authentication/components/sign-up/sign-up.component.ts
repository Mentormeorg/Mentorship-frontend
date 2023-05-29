import { Component, inject } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
    private _authService: AuthenticationService = inject(AuthenticationService);
    signupWithGoogle() {
        console.log('object');
        this._authService.googleAuth();
    }
    signupWithLinkedin() {
        console.log('object');
        this._authService.linkedinAuth();
    }

    signupWithGithub() {
        console.log('object');
        this._authService.githubAuth();
    }
    // what we need to do
    // 1. create a form with a template validation
    // integrate this with API call
}
