import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator for password strength
 * Requires: minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character
 */
export function passwordStrengthValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		if (!control.value) {
			return null; // Don't validate empty values (use required validator for that)
		}

		const value = control.value as string;
		const errors: ValidationErrors = {};

		// Minimum 8 characters
		if (value.length < 8) {
			errors['minLength'] = { requiredLength: 8, actualLength: value.length };
		}

		// At least one uppercase letter
		if (!/[A-Z]/.test(value)) {
			errors['uppercase'] = true;
		}

		// At least one lowercase letter
		if (!/[a-z]/.test(value)) {
			errors['lowercase'] = true;
		}

		// At least one number
		if (!/[0-9]/.test(value)) {
			errors['number'] = true;
		}

		// At least one special character
		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
			errors['specialChar'] = true;
		}

		return Object.keys(errors).length > 0 ? { passwordStrength: errors } : null;
	};
}

