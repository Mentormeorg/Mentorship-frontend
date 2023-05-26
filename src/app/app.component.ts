import { Component, OnInit, inject } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    private _translationService = inject(TranslateService);
    private _authService = inject(AuthenticationService);
    public title = 'Testing MentorChief';

    ngOnInit(): void {
        this._translationService.addLangs(['ar']);
        this._translationService.setDefaultLang('en');
        this._translationService.use('en');

        // this._authService.logout().subscribe(console.error);
    }
}
