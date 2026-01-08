import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, registrationCompletionGuard } from '@core/guards';
import { ConversationsListComponent } from './components/conversations-list/conversations-list.component';
import { ChatThreadComponent } from './components/chat-thread/chat-thread.component';

const routes: Routes = [
  {
    path: 'chat',
    canActivate: [authGuard, registrationCompletionGuard],
    children: [
      {
        path: '',
        component: ConversationsListComponent,
      },
      {
        path: ':id',
        component: ChatThreadComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}

