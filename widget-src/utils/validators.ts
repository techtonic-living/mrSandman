/**
 * Input Validators
 *
 * Validation functions for user input in the mrSandman widget.
 */

/**
 * Validation result type
 */
export type ValidationResult = { valid: true } | { valid: false; error: string };

/**
 * Validate that a string is not empty
 * @param value - String to validate
 * @param fieldName - Name of the field for error message
 * @returns Validation result
 */
export function validateRequired(
	value: string,
	fieldName: string = "This field"
): ValidationResult {
	if (!value || value.trim().length === 0) {
		return { valid: false, error: `${fieldName} is required` };
	}
	return { valid: true };
}

/**
 * Validate string length
 * @param value - String to validate
 * @param min - Minimum length (inclusive)
 * @param max - Maximum length (inclusive)
 * @param fieldName - Name of the field for error message
 * @returns Validation result
 */
export function validateLength(
	value: string,
	min: number,
	max: number,
	fieldName: string = "This field"
): ValidationResult {
	const length = value.trim().length;

	if (length < min) {
		return {
			valid: false,
			error: `${fieldName} must be at least ${min} characters`,
		};
	}

	if (length > max) {
		return {
			valid: false,
			error: `${fieldName} must be no more than ${max} characters`,
		};
	}

	return { valid: true };
}

/**
 * Validate number range
 * @param value - Number to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @param fieldName - Name of the field for error message
 * @returns Validation result
 */
export function validateRange(
	value: number,
	min: number,
	max: number,
	fieldName: string = "This value"
): ValidationResult {
	if (value < min || value > max) {
		return {
			valid: false,
			error: `${fieldName} must be between ${min} and ${max}`,
		};
	}
	return { valid: true };
}

/**
 * Validate email format (basic)
 * @param email - Email to validate
 * @returns Validation result
 */
export function validateEmail(email: string): ValidationResult {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailRegex.test(email)) {
		return { valid: false, error: "Invalid email format" };
	}

	return { valid: true };
}

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns Validation result
 */
export function validateURL(url: string): ValidationResult {
	try {
		new URL(url);
		return { valid: true };
	} catch {
		return { valid: false, error: "Invalid URL format" };
	}
}

/**
 * Validate that value matches a pattern
 * @param value - String to validate
 * @param pattern - RegExp pattern
 * @param errorMessage - Custom error message
 * @returns Validation result
 */
export function validatePattern(
	value: string,
	pattern: RegExp,
	errorMessage: string = "Invalid format"
): ValidationResult {
	if (!pattern.test(value)) {
		return { valid: false, error: errorMessage };
	}
	return { valid: true };
}

/**
 * Compose multiple validators
 * @param validators - Array of validation functions
 * @returns Combined validation result
 */
export function composeValidators<T = unknown>(
	...validators: ((value: T) => ValidationResult)[]
): (value: T) => ValidationResult {
	return (value: T) => {
		for (const validator of validators) {
			const res = validator(value);
			if (!res.valid) return res;
		}
		return { valid: true };
	};
}

// Add more validators as needed
