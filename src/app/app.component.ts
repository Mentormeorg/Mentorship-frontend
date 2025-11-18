import { Component, OnInit, inject } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { flagTypies } from 'flag-pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
	standalone: false
})
export class AppComponent implements OnInit {
  private _translationService = inject(TranslateService);
  private _authService = inject(AuthenticationService);

  public title = 'Testing MentorChief';
  public flagType: flagTypies = 'FIXED_WIDTH';
  ngOnInit(): void {
    this._translationService.addLangs(['ar']);
    this._translationService.setDefaultLang('en');
    this._translationService.use('en');

    // Initialize authentication state (check if user is already logged in)
    this._authService.initializeAuth();
  }
}
