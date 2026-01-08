import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentorshipRoutingModule } from './mentorship-routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [CommonModule, MentorshipRoutingModule, SharedModule],
})
export class MentorshipModule {}

