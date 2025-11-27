import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { AuthenticationLayoutComponent } from './authentication-layout/authentication-layout.component';
import {
  ForgetPasswordComponent,
  ResetPasswordComponent,
  SignInComponent,
  SignUpComponent,
} from './components';
import { CheckEmailComponent } from './components/check-email/check-email.component';
import { authGuard, guestGuard, registrationAccessGuard } from '@core/guards';

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
            component: SignInComponent,
            canActivate: [guestGuard],
          },
          {
            path: 'sign-up',
            component: SignUpComponent,
            canActivate: [guestGuard],
          },
        ],
      },

      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [guestGuard],
      },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent,
        canActivate: [guestGuard],
      },
      {
        path: 'check-email',
        component: CheckEmailComponent,
        canActivate: [guestGuard],
      },
      {
        path: 'registeration-steps',
        canActivate: [authGuard, registrationAccessGuard],
        loadChildren: () =>
          import(
            '../registration-steps/registration-steps.module'
          ).then(m => m.RegistrationStepsModule),
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
