import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator for phone number format
 * Supports formats: XXX-XXXXXXXX, (XXX) XXX-XXXX, XXX-XXX-XXXX, etc.
 * Validates that the phone number contains only digits (excluding formatting characters)
 * and has a minimum of 10 digits
 */
export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values (use required validator for that)
    }

    const value = control.value as string;

    // Remove all non-digit characters for validation
    const digitsOnly = value.replace(/\D/g, '');

    // Check if we have at least 10 digits (standard phone number length)
    if (digitsOnly.length < 10) {
      return {
        phoneNumber: {
          message: 'Phone number must contain at least 10 digits',
          actualLength: digitsOnly.length,
        },
      };
    }

    // Check if we have too many digits (more than 15 is invalid per ITU-T E.164)
    if (digitsOnly.length > 15) {
      return {
        phoneNumber: {
          message: 'Phone number must not exceed 15 digits',
          actualLength: digitsOnly.length,
        },
      };
    }

    // Check if the value contains only valid phone number characters
    // Allow digits, spaces, dashes, parentheses, plus sign, and dots
    const phonePattern = /^[\d\s\-()+.]+$/;
    if (!phonePattern.test(value)) {
      return {
        phoneNumber: {
          message: 'Phone number contains invalid characters',
        },
      };
    }

    return null;
  };
}
