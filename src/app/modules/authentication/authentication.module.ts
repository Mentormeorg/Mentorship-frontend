import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { AuthenticationLayoutComponent } from './authentication-layout/authentication-layout.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';

import { CallbackComponent } from './callback/callback.component';
import {
    AuthSliderComponent,
    ForgetPasswordComponent,
    LoginComponent,
    ResetPasswordComponent,
    SignUpComponent,
} from './components';

@NgModule({
    declarations: [
        AuthSliderComponent,
        AuthenticationLayoutComponent,
        LoginComponent,
        SignUpComponent,
        ResetPasswordComponent,
        ForgetPasswordComponent,
        AccountLayoutComponent,
        CallbackComponent,
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
        PasswordModule,
    ],
})
export class AuthenticationModule {}
