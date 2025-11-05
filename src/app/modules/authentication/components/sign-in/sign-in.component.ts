import { Component, OnInit, inject } from '@angular/core';
import { AuthProviderEnum } from '@core/enums';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  selector: 'app-signIn',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
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
