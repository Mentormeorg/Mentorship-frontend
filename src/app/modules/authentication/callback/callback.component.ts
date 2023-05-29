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
        console.log('object');
        this._activeRoute.queryParams.subscribe((params) => {
            console.log(params);
            if (params) {
                this._authService.setOAuthToken(params[this.tokenKey]);
                window.close();
                console.log('Authurized User	');
            } else {
                console.log('NON Authurized User');
            }
        });
    }
}
