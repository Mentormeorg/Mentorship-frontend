import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthProviderEnum } from '@core/enums';
import { PATHS } from '@core/paths';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
	selector: 'app-auth-base',
	templateUrl: './auth-base.component.html',
})

export abstract class AuthBaseComponent {
	protected providers = AuthProviderEnum;
	protected authService: AuthenticationService = inject(AuthenticationService);
	protected fb: FormBuilder = inject(FormBuilder);
	protected PATHS = PATHS;

	getformControl(formGroupName: FormGroup, controlName: string) {
		return formGroupName.get(controlName)
	}
}
