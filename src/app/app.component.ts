import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    private _translationService = inject(TranslateService);
    public title = 'Testing MentorChief';

    ngOnInit(): void {
        this._translationService.addLangs(['ar']);
        this._translationService.setDefaultLang('en');
        this._translationService.use('en');
    }
}
