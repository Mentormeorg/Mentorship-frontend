import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Gets the validation error message for a form control
 * @param control - The form control to check
 * @param fieldName - Optional custom field name for error messages
 * @returns The error message string or null if no error
 */
export function getValidationErrorMessage(
	control: AbstractControl | null,
	fieldName?: string
): string | null {
	if (!control || !control.errors || !control.touched) {
		return null;
	}

	const errors: ValidationErrors = control.errors;
	const field = fieldName || 'This field';

	// Required validation
	if (errors['required']) {
		return `${field} is required`;
	}

	// Email validation
	if (errors['email']) {
		return `${field} must be a valid email address`;
	}

	// Min length validation
	if (errors['minlength']) {
		const requiredLength = errors['minlength'].requiredLength;
		return `${field} must be at least ${requiredLength} characters`;
	}

	// Max length validation
	if (errors['maxlength']) {
		const requiredLength = errors['maxlength'].requiredLength;
		return `${field} must not exceed ${requiredLength} characters`;
	}

	// Min value validation
	if (errors['min']) {
		const min = errors['min'].min;
		return `${field} must be at least ${min}`;
	}

	// Max value validation
	if (errors['max']) {
		const max = errors['max'].max;
		return `${field} must not exceed ${max}`;
	}

	// Pattern validation
	if (errors['pattern']) {
		return `${field} format is invalid`;
	}

	// Custom matchInputs validation (for password confirmation)
	if (errors['matchInputs']) {
		return 'Passwords do not match';
	}

	// Phone number validation
	if (errors['phoneNumber']) {
		const phoneError = errors['phoneNumber'];
		if (phoneError.message) {
			return phoneError.message;
		}
		return `${field} format is invalid`;
	}

	// Default error message
	return `${field} is invalid`;
}

