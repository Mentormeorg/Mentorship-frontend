import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { AuthenticationLayoutComponent } from './authentication-layout/authentication-layout.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';

import { SharedModule } from '@shared/shared.module';
import { CallbackComponent } from './callback/callback.component';
import {
    AuthSliderComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    SignInComponent,
    SignUpComponent,
} from './components';
import { CheckEmailComponent } from './components/check-email/check-email.component';

@NgModule({
    declarations: [
        AuthSliderComponent,
        AuthenticationLayoutComponent,
        SignInComponent,
        SignUpComponent,
        ResetPasswordComponent,
        ForgetPasswordComponent,
        AccountLayoutComponent,
        CallbackComponent,
        CheckEmailComponent,
    ],
    imports: [
        CommonModule,
        AuthenticationRoutingModule,
        FormsModule,
        SharedModule,
    ],
})
export class AuthenticationModule {}
