import { Component, OnInit, inject } from '@angular/core';
import { AuthProviderEnum } from '@core/enums';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  selector: 'app-signin',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
	standalone: false
})
export class SignInComponent implements OnInit {
  public providers = AuthProviderEnum;
  public authService: AuthenticationService = inject(
    AuthenticationService
  );
  public email = '';
  public password = '';
  public isAuthenticated = this.authService.isAuthenticated;

  ngOnInit(): void {
    this.authService.authenticationWindowBinder('signIn');
  }
}
