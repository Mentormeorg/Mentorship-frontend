import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

/*
	? Add wildcard route to redirect to 404 page [Shared Component] 👍
	? Add route to Login page 👍
	? Add route to Register page 👍
	? Add route to Forgot Password page 👍
	? Add route to Reset Password page 👍
	? Add route to Verify Email page 👍
	------------------------------------
	* Add Guard to protect main route from authenticated users and redirect to Home page
*/

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{ path: '', redirectTo: 'login', pathMatch: 'full' },
			{ path: 'login', component: LoginComponent },
			{ path: 'register', component: RegisterComponent },
			{ path: 'forget-password', component: ForgetPasswordComponent },
			{ path: 'reset-password', component: ResetPasswordComponent },
			{ path: 'verify-email', component: VerifyEmailComponent },
		],
	},
	{
		path: '**',
		redirectTo: '404',
		pathMatch: 'full',
	},
	{
		path: '404',
		component: NotFoundComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
