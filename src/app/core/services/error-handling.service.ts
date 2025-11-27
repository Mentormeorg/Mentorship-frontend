import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ErrorsEnum as Errors } from '@core/enums/errors.enum';

@Injectable({
	providedIn: 'root',
})
export class ErrorHandlingService {
	private messageService: MessageService = inject(MessageService);

	/**
	 * Handles errors and shows appropriate toast notifications
	 * @param error - The error object (can be HttpErrorResponse, Supabase error, or any error)
	 * @param customSummary - Optional custom summary for the toast
	 * @returns The extracted error message
	 */
	public handleError(error: unknown, customSummary?: string): string {
		let errorMessage = '';
		let statusCode: number | null = null;

		// Handle HttpErrorResponse (Angular HttpClient errors)
		if (error instanceof HttpErrorResponse) {
			statusCode = error.status;
			if (error.error instanceof ErrorEvent) {
				// Client-side error
				errorMessage = `Error: ${error.error.message}`;
			} else {
				// Server-side error
				errorMessage = this.getErrorMessageFromStatus(error.status, error.error);
			}
		}
		// Handle Supabase errors
		else if (error && typeof error === 'object') {
			const supabaseError = error as {
				message?: string;
				status?: number;
				error?: { message?: string };
				code?: string;
			};
			statusCode = supabaseError.status || null;
			// Supabase errors can have message directly or nested in error property
			errorMessage = supabaseError.message ||
				supabaseError.error?.message ||
				(supabaseError.code ? `Error: ${supabaseError.code}` : null) ||
				'An error occurred';
		}
		// Handle string errors
		else if (typeof error === 'string') {
			errorMessage = error;
		}
		// Handle generic errors
		else if (error instanceof Error) {
			errorMessage = error.message || 'An error occurred';
		}
		// Fallback
		else {
			errorMessage = 'An unexpected error occurred';
		}

		// Determine summary based on status code or use custom summary
		const summary = customSummary || this.getSummaryFromStatus(statusCode);

		// Show toast notification
		this.messageService.add({
			severity: 'error',
			summary: summary,
			detail: errorMessage,
		});

		return errorMessage;
	}

	/**
	 * Shows a success toast notification
	 * @param message - The success message to display
	 * @param summary - Optional custom summary for the toast (defaults to 'Success')
	 */
	public showSuccess(message: string, summary = 'Success'): void {
		this.messageService.add({
			severity: 'success',
			summary: summary,
			detail: message,
		});
	}

	/**
	 * Gets error message based on HTTP status code
	 */
	private getErrorMessageFromStatus(status: number, errorBody?: { message?: string }): string {
		switch (status) {
			case Errors.BAD_REQUEST:
				return errorBody?.message || 'Bad Request';
			case Errors.UNAUTHORIZED:
				return 'Unauthorized - Please login again';
			case Errors.FORBIDDEN:
				return 'Forbidden - You do not have permission to access this resource';
			case Errors.NOT_FOUND:
				return 'Resource not found';
			case Errors.CONFLICT:
				return errorBody?.message || 'Conflict - The resource already exists';
			case Errors.UNPROCESSABLE_ENTITY:
				return errorBody?.message || 'Validation Error - Please check your input';
			case Errors.INTERNAL_SERVER_ERROR:
				return errorBody?.message || 'Internal Server Error - Please try again later';
			default:
				return errorBody?.message || `Error Code: ${status}`;
		}
	}

	/**
	 * Gets summary text based on HTTP status code
	 */
	private getSummaryFromStatus(status: number | null): string {
		if (!status) return 'Error';

		switch (status) {
			case Errors.BAD_REQUEST:
				return 'Bad Request';
			case Errors.UNAUTHORIZED:
				return 'Unauthorized';
			case Errors.FORBIDDEN:
				return 'Forbidden';
			case Errors.NOT_FOUND:
				return 'Not Found';
			case Errors.CONFLICT:
				return 'Conflict';
			case Errors.UNPROCESSABLE_ENTITY:
				return 'Validation Error';
			case Errors.INTERNAL_SERVER_ERROR:
				return 'Server Error';
			default:
				return 'Error';
		}
	}
}

