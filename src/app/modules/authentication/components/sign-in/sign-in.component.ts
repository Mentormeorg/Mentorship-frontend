import { Component } from '@angular/core';
import { AuthBaseComponent } from '../auth-base/auth-base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-signin',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss'],
	standalone: false
})

export class SignInComponent extends AuthBaseComponent {
	public loginForm: FormGroup;

	constructor() {
		super();

		this.loginForm = this.fb.group<{
			email: FormControl<string | null>,
			password: FormControl<string | null>,
		}>({
			email: new FormControl<string>('', [Validators.required, Validators.email]),
			password: new FormControl<string | null>('', [Validators.required, Validators.minLength(6)])
		})
	}

}
