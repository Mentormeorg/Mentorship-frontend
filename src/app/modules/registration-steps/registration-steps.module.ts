import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InputMaskModule } from 'primeng/inputmask';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepsModule } from 'primeng/steps';
import { BiographyComponent } from './components/biography/biography.component';
import { CareerInfoComponent } from './components/career-info/career-info.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { PreferenceComponent } from './components/preference/preference.component';
import { RegistrationBannerComponent } from './components/registration-banner/registration-banner.component';
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
        RegistrationBannerComponent,
    ],
    imports: [
        CommonModule,
        RegistrationStepsRoutingModule,
        StepsModule,
        FormsModule,
        ButtonModule,
        ReactiveFormsModule,
        InputNumberModule,
        FormsModule,
        RadioButtonModule,
        InputTextModule,
        PasswordModule,
        DropdownModule,
        ChipsModule,
        InputTextareaModule,
        InputMaskModule,
    ],
})
export class RegistrationStepsModule {}
