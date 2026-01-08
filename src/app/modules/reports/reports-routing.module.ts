import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, registrationCompletionGuard } from '@core/guards';
import { ReportListComponent } from './components/report-list/report-list.component';
import { ReportViewComponent } from './components/report-view/report-view.component';
import { ReportFormComponent } from './components/report-form/report-form.component';

const routes: Routes = [
  {
    path: 'reports',
    canActivate: [authGuard, registrationCompletionGuard],
    children: [
      {
        path: '',
        component: ReportListComponent,
      },
      {
        path: ':id',
        component: ReportViewComponent,
      },
      {
        path: 'create/:mentorshipId',
        component: ReportFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}

