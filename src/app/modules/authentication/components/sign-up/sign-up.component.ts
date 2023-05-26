import { Component, inject } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
    private _authService: AuthenticationService = inject(AuthenticationService);
    signInWithGoogle() {
        console.log('object');
        this._authService.googleAuth().subscribe(console.log);
    }
    signInWithLinkedin() {
        console.log('object');
        this._authService.linkedinAuth().subscribe(console.log);
    }
    // what we need to do
    // 1. create a form with a template validation
    // integrate this with API call
}
