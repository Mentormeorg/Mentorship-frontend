import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationLayoutComponent } from './authentication-layout/authentication-layout.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { AccountLayoutComponent } from './account-layout/account-layout.component';

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
