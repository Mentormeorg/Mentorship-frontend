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
      {
        path: 'mentorships',
        loadChildren: () =>
          import('../mentorship/mentorship.module').then(
            m => m.MentorshipModule
          ),
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('../chat/chat.module').then(
            m => m.ChatModule
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../reports/reports.module').then(
            m => m.ReportsModule
          ),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('../payments/payments.module').then(
            m => m.PaymentsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
