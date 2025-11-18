import { Component, ViewEncapsulation } from '@angular/core';
import { PATHS } from '@core/paths';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
	standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {
  paths = PATHS;
}
