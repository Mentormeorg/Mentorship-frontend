import { Component } from '@angular/core';
import { PATHS } from '@core/paths';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
    paths = PATHS;
}
