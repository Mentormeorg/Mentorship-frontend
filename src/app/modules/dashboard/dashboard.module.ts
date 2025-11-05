import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { flagPipeModule } from 'flag-pipe';

import { MentorCardComponent } from './_components/_metor-card-components/dumb/mentor-card/mentor-card.component';
import { SmartMentorCardsComponent } from './_components/_metor-card-components/smart/smart-mentor-cards-container/smart-mentor-cards.component';
import { DiscoverPageComponent } from './_pages/discover-page/discover-page.component';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MultiFiltersFormComponent } from './_components/_filters-components/dumb/multi-filters-form/multi-filters-form.component';
import { SmartMultiFiltersFormComponent } from './_components/_filters-components/smart/smart-multi-filters-form/smart-multi-filters-form.component';

@NgModule({
  declarations: [
    DashboardMainComponent,
    MentorCardComponent,
    SmartMentorCardsComponent,
    DiscoverPageComponent,
    MultiFiltersFormComponent,
    SmartMultiFiltersFormComponent,
  ],
  imports: [
    SharedModule,
    flagPipeModule,
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    NgOptimizedImage,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class DashboardModule {}
