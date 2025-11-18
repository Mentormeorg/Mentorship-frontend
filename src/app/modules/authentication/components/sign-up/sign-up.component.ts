import { Component, OnInit, inject } from '@angular/core';
import { AuthProviderEnum } from '@core/enums';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
	standalone: false
})
export class SignUpComponent implements OnInit {
  public authService: AuthenticationService = inject(
    AuthenticationService
  );
  public providers = AuthProviderEnum;

  ngOnInit() {
    this.authService.authenticationWindowBinder('signup');
  }
}
