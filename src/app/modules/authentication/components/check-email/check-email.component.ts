import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { AuthBaseComponent } from '../auth-base/auth-base.component';
import { ActivatedRoute } from '@angular/router';
import { timer, map, takeWhile, Observable, finalize, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorHandlingService } from '@core/services/error-handling.service';

@Component({
	selector: 'app-check-email',
	templateUrl: './check-email.component.html',
	styleUrls: ['./check-email.component.scss'],
	standalone: false
})
export class CheckEmailComponent extends AuthBaseComponent implements OnInit, OnDestroy {
	seconds = 60;
	resendDisabled = false;
	timeRemaining$: Observable<number> | undefined;
	public email= '';
	public isLoading= false;
	private _errorHandler = inject(ErrorHandlingService);
	private _destroy$ = new Subject<void>();

	constructor(private route: ActivatedRoute) {
		super();
	}

	ngOnInit(): void {
		// Get email from query params, route params, or user data
		combineLatest([
			this.route.queryParams,
			this.route.params,
			this.authService.userData
		])
			.pipe(takeUntil(this._destroy$))
			.subscribe(([queryParams, routeParams, user]) => {
				this.email = queryParams['email']
					|| routeParams['email']
					|| user?.email
					|| '';
			});
	}

	ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	resendEmail() {
		if (!this.email) {
			this._errorHandler.handleError(
				'Email address is required to resend verification.',
				'Resend Verification'
			);
			return;
		}

		if (this.resendDisabled) {
			return;
		}

		this.isLoading = true;
		this.resendDisabled = true;

		this.authService.resendVerificationEmail(this.email)
			.pipe(
				finalize(() => {
					this.isLoading = false;
					this.startResendTimer();
				})
			)
			.subscribe({
				next: (success) => {
					if (success) {
						// Timer will be started in finalize
					}
				},
				error: () => {
					// Error is already handled in the service
					this.resendDisabled = false;
				}
			});
	}

	private startResendTimer(): void {
		this.timeRemaining$ = timer(0, 1000).pipe(
			map(n => {
				const remaining = this.seconds - n;
				this.resendDisabled = remaining > 0;
				return remaining * 1000;
			}),
			takeWhile(n => n >= 0),
		);
	}
}
