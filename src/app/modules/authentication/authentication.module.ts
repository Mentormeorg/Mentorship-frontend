import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthSliderComponent } from './components/auth-slider/auth-slider.component';
import { AuthenticationLayoutComponent } from './authentication-layout/authentication-layout.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
    declarations: [
        AuthSliderComponent,
        AuthenticationLayoutComponent,
        LoginComponent,
        SignUpComponent,
        ResetPasswordComponent,
        ForgetPasswordComponent,
        AccountLayoutComponent,
    ],
    imports: [
        CommonModule,
        AuthenticationRoutingModule,
        CarouselModule,
        AuthenticationRoutingModule,
        DropdownModule,
        FormsModule,
        DividerModule,
        ButtonModule,
        InputTextModule,
    ],
})
export class AuthenticationModule {}
