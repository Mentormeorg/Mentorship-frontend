import { Component } from '@angular/core';
import { AuthBaseComponent } from '../auth-base/auth-base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthProviderEnum } from '@core/enums';
import { getValidationErrorMessage } from '@shared/utils/validation.utils';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-signin',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss'],
	standalone: false
})

export class SignInComponent extends AuthBaseComponent {
	public loginForm: FormGroup;
	public isLoading: boolean = false;

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

	authUser(provider?: AuthProviderEnum) {
		if (provider) {
			this.isLoading = true;
			this.authService.socialAuth(provider)
				.pipe(
					finalize(() => this.isLoading = false)
				)
				.subscribe({
					error: (error) => {
						// Error is already handled in the service
						console.error('Social auth error:', error);
					}
				});
		} else {
			// Mark all fields as touched to show validation errors
			if (this.loginForm.invalid) {
				this.loginForm.markAllAsTouched();
				return;
			}

			this.isLoading = true;
			this.authService.login(this.loginForm.value)
				.pipe(
					finalize(() => this.isLoading = false)
				)
				.subscribe({
					next: (user) => {
						if (!user) {
							// Login failed - error already shown by service
							this.loginForm.reset();
						}
					},
					error: (error) => {
						// Error is already handled in the service
						console.error('Login error:', error);
						this.loginForm.reset();
					}
				});
		}
	}

	getErrorMessage(controlName: string): string | null {
		const control = this.loginForm.get(controlName);
		const fieldNames: { [key: string]: string } = {
			email: 'Email',
			password: 'Password'
		};
		return getValidationErrorMessage(control, fieldNames[controlName]);
	}
}
