import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { finalize, map } from 'rxjs';

@Component({
    selector: 'app-callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
    private _activeRoute: ActivatedRoute = inject(ActivatedRoute);
    private _router: Router = inject(Router);
    private _authService: AuthenticationService = inject(AuthenticationService);
    private readonly tokenKey = 'code';

    ngOnInit(): void {
        this._activeRoute.queryParams.subscribe((params) => {
            if (params) {
                // window.close();
                this._authService.isAuthenticated.pipe(
                    map(() => {
                        this._authService.setOAuthToken(params[this.tokenKey]);
                        localStorage.getItem(params[this.tokenKey]);
                    }),
                    finalize(() => {
                        window.close();
                    })
                );

                console.log('Authurized User	');
            } else {
                console.log('NON Authurized User');
            }
        });
    }
}
