import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { MentorCardComponent } from './_components/_metor-card-components/dumb/mentor-card/mentor-card.component';
import { SmartMentorCardsComponent } from './_components/_metor-card-components/smart/smart-mentor-cards-container/smart-mentor-cards.component';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DiscoverPageComponent } from './_pages/discover-page/discover-page.component';

@NgModule({
    declarations: [
        DashboardMainComponent,
        MentorCardComponent,
        SmartMentorCardsComponent,
        DiscoverPageComponent,
    ],
    imports: [
        SharedModule,
        CommonModule,
        DashboardRoutingModule,
        FormsModule,
        RatingModule,
        TagModule,
        NgOptimizedImage,
    ],
})
export class DashboardModule {}
