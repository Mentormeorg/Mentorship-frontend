import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { catchError } from 'rxjs';

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
        this._activeRoute.queryParams
            .pipe(catchError(async () => window.close()))
            .subscribe((params) => {
                if (params) {
                    this._authService.OAuthToken.next(params[this.tokenKey]);
                }
                window.close();
            });
    }
}
