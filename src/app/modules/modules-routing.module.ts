import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        m => m.AuthenticationModule
      ),
  },
  {
    path: 'home',
    loadComponent: () => {
      return import('./landing-page/home/home.component').then(
        m => m.HomeComponent
      );
    },
  },
  {
    path: 'dashboard',
    loadChildren: () => {
      return import('./dashboard/dashboard.module').then(
        m => m.DashboardModule
      );
    },
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulesRoutingModule {}
