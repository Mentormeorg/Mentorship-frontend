import { Component } from '@angular/core';
import { AuthBaseComponent } from '../auth-base/auth-base.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { matchInputsValidator } from '@shared/validators';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
	standalone: false
})
export class ResetPasswordComponent extends AuthBaseComponent {
	public resetPasswordForm: FormGroup;

	constructor() {
		super();

		this.resetPasswordForm = this.fb.group<{
			password: FormControl<string | null>,
			confirmationPassword: FormControl<string | null>
		}>({
			password: new FormControl<string>('', [Validators.required]),
			confirmationPassword: new FormControl<string>('', [Validators.required, matchInputsValidator('password', 'confirmationPassword')])
		})
	}
}
