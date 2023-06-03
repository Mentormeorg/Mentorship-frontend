import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
    selector: 'app-callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
    private _activeRoute: ActivatedRoute = inject(ActivatedRoute);
    private _authService: AuthenticationService = inject(AuthenticationService);
    private readonly tokenKey = 'code';

    ngOnInit(): void {
        this._activeRoute.queryParams.subscribe((params) => {
            if (params) {
                this._authService.setOAuthToken(params[this.tokenKey]);
                this._authService.isAuthenticated.next(true);
                window.close();
            }
        });
    }
}
