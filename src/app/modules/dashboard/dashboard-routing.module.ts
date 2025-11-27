import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscoverPageComponent } from './_pages/discover-page/discover-page.component';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';
import { authGuard, registrationCompletionGuard } from '@core/guards';

const routes: Routes = [
  {
    path: '',
    component: DashboardMainComponent,
    canActivate: [authGuard, registrationCompletionGuard],
    children: [
      {
        path: '',
        redirectTo: 'discover',
        pathMatch: 'full',
      },
      {
        path: 'discover',
        component: DiscoverPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
