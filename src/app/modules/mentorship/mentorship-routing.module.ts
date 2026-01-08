import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, registrationCompletionGuard } from '@core/guards';
import { MentorApplicationComponent } from './components/mentor-application/mentor-application.component';
import { MentorshipRequestComponent } from './components/mentorship-request/mentorship-request.component';
import { MentorshipListComponent } from './components/mentorship-list/mentorship-list.component';
import { MentorshipDetailsComponent } from './components/mentorship-details/mentorship-details.component';

const routes: Routes = [
  {
    path: 'mentorships',
    canActivate: [authGuard, registrationCompletionGuard],
    children: [
      {
        path: '',
        component: MentorshipListComponent,
      },
      {
        path: ':id',
        component: MentorshipDetailsComponent,
      },
      {
        path: 'request/:mentorId',
        component: MentorshipRequestComponent,
      },
    ],
  },
  {
    path: 'mentor/apply',
    component: MentorApplicationComponent,
    canActivate: [authGuard, registrationCompletionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MentorshipRoutingModule {}

