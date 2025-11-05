import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { AuthenticationLayoutComponent } from './authentication-layout/authentication-layout.component';
import { CallbackComponent } from './callback/callback.component';
import {
  ForgetPasswordComponent,
  ResetPasswordComponent,
  SignInComponent,
  SignUpComponent,
} from './components';
import { CheckEmailComponent } from './components/check-email/check-email.component';

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
        path: 'check-email',
        component: CheckEmailComponent,
      },
      {
        path: 'registeration-steps',
        loadChildren: () =>
          import(
            '../registration-steps/registration-steps.module'
          ).then(m => m.RegistrationStepsModule),
      },
      {
        path: 'callback',
        component: CallbackComponent,
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
