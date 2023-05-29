import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-registration-steps-layout',
    templateUrl: './registration-steps-layout.component.html',
    styleUrls: ['./registration-steps-layout.component.scss'],
})
export class RegistrationStepsLayoutComponent {
    items!: MenuItem[];

    constructor() {
        this.items = [
            {
                label: 'Role Info',
                routerLink: 'role-info',
            },
            {
                label: 'Personal Info',
                routerLink: 'personal-info',
            },
            {
                label: 'Career Info',
                routerLink: 'career-info',
            },
            {
                label: 'Biography',
                routerLink: 'biography',
            },
            {
                label: 'Preference',
                routerLink: 'preference',
            },
        ];
    }
}
