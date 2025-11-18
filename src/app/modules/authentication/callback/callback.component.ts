import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-callback',
	templateUrl: './callback.component.html',
	styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit, OnDestroy {
	private _activeRoute: ActivatedRoute = inject(ActivatedRoute);
	private _authService: AuthenticationService = inject(
		AuthenticationService
	);
	private readonly tokenKey = 'access_token';
	private subscriptions: Subscription = new Subscription;

	private filterOuthValues() {
		console.log('fired')
		this.subscriptions.add(this._activeRoute.fragment.subscribe(params => {
			if (!params) return;
			const authObj: { [key: string]: string } = {};
			params?.split('&').forEach((row) => {
				const props = row.split('=');
				const key = props[0];
				const value = props[1];
				authObj[key] = value
			})

			this._authService.setOAuthToken(authObj[this.tokenKey]);
			this._authService.isAuthenticated.next(true);
		}));
	}

	ngOnInit(): void {
		this.filterOuthValues();
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

}
