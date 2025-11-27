import { Component } from '@angular/core';
import { AuthBaseComponent } from '../auth-base/auth-base.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { matchInputsValidator } from '@shared/validators';
import { getValidationErrorMessage } from '@shared/utils/validation.utils';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
	standalone: false
})
export class ResetPasswordComponent extends AuthBaseComponent {
	public resetPasswordForm: FormGroup;
	public isLoading: boolean = false;

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

	getErrorMessage(controlName: string): string | null {
		const control = this.resetPasswordForm.get(controlName);
		const fieldNames: { [key: string]: string } = {
			password: 'New Password',
			confirmationPassword: 'Confirm Password'
		};
		return getValidationErrorMessage(control, fieldNames[controlName]);
	}

	resetPassword() {
		// Mark all fields as touched to show validation errors
		if (this.resetPasswordForm.invalid) {
			this.resetPasswordForm.markAllAsTouched();
			return;
		}

		this.isLoading = true;
		this.authService.resetPassword({
			newPassword: this.getformControl(this.resetPasswordForm, 'password')?.value
		})
			.pipe(
				finalize(() => this.isLoading = false)
			)
			.subscribe({
				next: (success) => {
					if (success) {
						this.resetPasswordForm.reset();
					}
				},
				error: (error) => {
					// Error is already handled in the service
					console.error('Reset password error:', error);
				}
			});
	}
}
