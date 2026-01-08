import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, adminGuard } from '@core/guards';
import { MentorApplicationsReviewComponent } from './components/mentor-applications-review/mentor-applications-review.component';

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'mentor-applications',
        component: MentorApplicationsReviewComponent,
      },
      // Additional admin routes can be added here
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

