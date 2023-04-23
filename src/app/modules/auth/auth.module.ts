import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
	declarations: [
		AuthComponent,
		LoginComponent,
		RegisterComponent,
		VerifyEmailComponent,
		ResetPasswordComponent,
		ForgetPasswordComponent,
	],
	imports: [CommonModule, AuthRoutingModule, SharedModule],
})
export class AuthModule {}
