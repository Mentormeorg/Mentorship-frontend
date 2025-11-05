import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  BiographyComponent,
  CareerInfoComponent,
  PersonalInfoComponent,
  PreferenceComponent,
  RegistrationStepsLayoutComponent,
  RoleInfoComponent,
} from './components';

const routes: Routes = [
  {
    path: '',
    component: RegistrationStepsLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'role-info',
        pathMatch: 'full',
      },
      {
        path: 'role-info',
        component: RoleInfoComponent,
      },
      {
        path: 'personal-info',
        component: PersonalInfoComponent,
      },
      {
        path: 'career-info',
        component: CareerInfoComponent,
      },
      {
        path: 'biography',
        component: BiographyComponent,
      },
      {
        path: 'preference',
        component: PreferenceComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationStepsRoutingModule {}
