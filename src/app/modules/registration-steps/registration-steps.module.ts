import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
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
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
})
export class RegistrationStepsModule {}
