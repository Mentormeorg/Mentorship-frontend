import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'Mentorship-frontend';
	cities: string[] = ['Egypt', 'USA', 'Germany', 'Italy', 'France'];
	selectedCity = 'Egypt';
}
