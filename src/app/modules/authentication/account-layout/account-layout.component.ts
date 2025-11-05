import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './account-layout.component.html',
  styleUrls: ['./account-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AccountLayoutComponent {
  languagesList = [
    {
      lable: 'En',
      value: 'en',
    },
    {
      lable: 'Ar',
      value: 'ar',
    },
  ];
  _currentLanguage =
    window.localStorage.getItem('lang') ||
    this._translateService.getDefaultLang();

  currentLanguage:
    | {
        lable: string;
        value: string;
      }
    | undefined = undefined;

  constructor(private _translateService: TranslateService) {
    this.languagesList = this._translateService
      .getLangs()
      .map(lang => {
        return {
          lable: lang[0].toUpperCase() + lang.slice(1),
          value: lang,
        };
      });
    this.currentLanguage = {
      lable: this._currentLanguage,
      value: this._currentLanguage,
    };
  }
}
