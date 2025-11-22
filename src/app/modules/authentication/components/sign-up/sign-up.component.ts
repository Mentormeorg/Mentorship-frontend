import { Component, OnInit, inject } from '@angular/core';
import { AuthProviderEnum } from '@core/enums';
import { AuthenticationService } from '@core/services/authentication.service';
import { AuthBaseComponent } from '../auth-base/auth-base.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
	standalone: false
})
export class SignUpComponent extends AuthBaseComponent implements OnInit {
  ngOnInit() {
    this.authService.authenticationWindowBinder('signup');
  }
}
