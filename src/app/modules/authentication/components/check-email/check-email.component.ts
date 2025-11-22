import { Component } from '@angular/core';
import { AuthBaseComponent } from '../auth-base/auth-base.component';
import { timer, map, takeWhile, Observable } from 'rxjs';

@Component({
	selector: 'app-check-email',
	templateUrl: './check-email.component.html',
	styleUrls: ['./check-email.component.scss'],
	standalone: false
})
export class CheckEmailComponent extends AuthBaseComponent {
	seconds = 5
	resendDisabled = false;
	timeRemaining$: Observable<number> | undefined;

	constructor() {
		super();

	}

	resendEmail() {
		this.authService.resendVerificationEmail('officialmentorchief@gmail.com').subscribe(() => {
			this.timeRemaining$ = timer(0, 1000).pipe(
				map(n => {
					(this.seconds - n) > 0 ? this.resendDisabled = true : this.resendDisabled = false
					return (this.seconds - n) * 1000
				}),

				takeWhile(n => n >= 0),
			);
		})
	}
}
