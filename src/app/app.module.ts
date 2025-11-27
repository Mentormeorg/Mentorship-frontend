import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModulesModule } from '@modules/modules.module';
import {
	TranslateLoader,
	TranslateModule,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './modules/landing-page/home/home.component';
import { AppComponent } from './app.component';
import { MessageService } from 'primeng/api';
import { NgPrimeModule } from '@shared/ng-prime.module';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HomeComponent,
		HttpClientModule,
		ModulesModule,
		NgPrimeModule,

		TranslateModule.forRoot({
			defaultLanguage: 'en',
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient],
			},
		}),
	],
	bootstrap: [AppComponent],
	providers: [
		MessageService
	]
})
export class AppModule { }
