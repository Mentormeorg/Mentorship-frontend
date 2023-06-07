import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';
import { BiographyComponent } from './components/biography/biography.component';
import { CareerInfoComponent } from './components/career-info/career-info.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { PreferenceComponent } from './components/preference/preference.component';
import { RegistrationStepsLayoutComponent } from './components/registration-steps-layout/registration-steps-layout.component';
import { RoleInfoComponent } from './components/role-info/role-info.component';
import { RegistrationStepsRoutingModule } from './registration-steps-routing.module';

@NgModule({
    declarations: [
        RegistrationStepsLayoutComponent,
        RoleInfoComponent,
        PersonalInfoComponent,
        CareerInfoComponent,
        BiographyComponent,
        PreferenceComponent,
    ],
    imports: [
        CommonModule,
        RegistrationStepsRoutingModule,
        StepsModule,
        FormsModule,
        ButtonModule,
    ],
})
export class RegistrationStepsModule {}
