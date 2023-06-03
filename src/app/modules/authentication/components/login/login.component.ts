import { Component, OnInit, inject } from '@angular/core';
import { AuthProviderEnum } from '@core/enums';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    public providers = AuthProviderEnum;
    public authService: AuthenticationService = inject(AuthenticationService);
    public email = '';
    public password = '';
    public isAuthenticated = this.authService.isAuthenticated;

    ngOnInit(): void {
        this.authService.authenticationWindowBinder('login');
    }
}
