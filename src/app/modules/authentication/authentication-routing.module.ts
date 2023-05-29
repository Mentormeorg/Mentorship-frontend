import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { AuthenticationLayoutComponent } from './authentication-layout/authentication-layout.component';
import { CallbackComponent } from './callback/callback.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
    {
        path: '',
        component: AccountLayoutComponent,
        children: [
            {
                path: '',
                component: AuthenticationLayoutComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'sign-in',
                        pathMatch: 'full',
                    },
                    {
                        path: 'sign-in',
                        component: LoginComponent,
                    },
                    {
                        path: 'sign-up',
                        component: SignUpComponent,
                    },
                ],
            },

            {
                path: 'reset-password',
                component: ResetPasswordComponent,
            },
            {
                path: 'callback',
                component: CallbackComponent,
            },
            {
                path: 'forget-password',
                component: ForgetPasswordComponent,
            },
            {
                path: '**',
                redirectTo: 'sign-up',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
