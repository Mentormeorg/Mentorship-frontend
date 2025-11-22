import { Component } from '@angular/core';
import { AuthBaseComponent } from '../auth-base/auth-base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-forget-password',
	templateUrl: './forget-password.component.html',
	styleUrls: ['./forget-password.component.scss'],
	standalone: false
})
export class ForgetPasswordComponent extends AuthBaseComponent {
	public forgetPasswordForm: FormGroup;

	constructor() {
		super();

		this.forgetPasswordForm = this.fb.group<{
			email: FormControl<string | null>
		}>({
			email: new FormControl<string>('', [Validators.required, Validators.email])
		})
	}
}
