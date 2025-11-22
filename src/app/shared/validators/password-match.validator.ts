import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function matchInputsValidator(controlName1: string, controlName2: string): ValidatorFn {
	return (formGroup: AbstractControl): ValidationErrors | null => {
		const control1 = formGroup.get(controlName1);
		const control2 = formGroup.get(controlName2);

		if (!control1 || !control2) {
			return null; // Controls not found, no validation
		}

		if (control2.errors && !control2.errors['matchInputs']) {
			return null; // Other errors on control2, don't override
		}

		if (control1.value !== control2.value) {
			control2.setErrors({ matchInputs: true });
			return { matchInputs: true };
		} else {
			control2.setErrors(null); // Clear previous errors if they matched
			return null;
		}
	};
}
