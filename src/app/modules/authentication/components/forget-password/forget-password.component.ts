import { Component } from '@angular/core';
import { AuthBaseComponent } from '../auth-base/auth-base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getValidationErrorMessage } from '@shared/utils/validation.utils';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-forget-password',
	templateUrl: './forget-password.component.html',
	styleUrls: ['./forget-password.component.scss'],
	standalone: false
})
export class ForgetPasswordComponent extends AuthBaseComponent {
	public forgetPasswordForm: FormGroup;
	public isLoading: boolean = false;

	constructor() {
		super();

		this.forgetPasswordForm = this.fb.group<{
			email: FormControl<string | null>
		}>({
			email: new FormControl<string>('', [Validators.required, Validators.email])
		})
	}

	getErrorMessage(controlName: string): string | null {
		const control = this.forgetPasswordForm.get(controlName);
		const fieldNames: { [key: string]: string } = {
			email: 'Email'
		};
		return getValidationErrorMessage(control, fieldNames[controlName]);
	}

	sendResetEmail() {
		// Mark all fields as touched to show validation errors
		if (this.forgetPasswordForm.invalid) {
			this.forgetPasswordForm.markAllAsTouched();
			return;
		}

		this.isLoading = true;
		this.authService.forgetPassword(this.forgetPasswordForm.value)
			.pipe(
				finalize(() => this.isLoading = false)
			)
			.subscribe({
				next: (success) => {
					if (success) {
						this.forgetPasswordForm.reset();
					}
				},
				error: (error) => {
					// Error is already handled in the service
					console.error('Forget password error:', error);
				}
			});
	}
}
