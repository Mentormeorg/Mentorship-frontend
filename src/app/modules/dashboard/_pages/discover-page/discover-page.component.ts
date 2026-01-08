// eslint-disable-next-line check-file/folder-naming-convention
import { Component, ViewChild } from '@angular/core';
import { SmartMentorCardsComponent } from '@modules/dashboard/_components/_metor-card-components/smart/smart-mentor-cards-container/smart-mentor-cards.component';
import { IMentorFilters } from '@modules/dashboard/services/mentors.service';

@Component({
  selector: 'app-discover-page',
  templateUrl: './discover-page.component.html',
  styleUrls: ['./discover-page.component.scss'],
})
export class DiscoverPageComponent {
  @ViewChild('mentorCards') mentorCardsComponent?: SmartMentorCardsComponent;

  onFiltersChange(filters: IMentorFilters): void {
    if (this.mentorCardsComponent) {
      this.mentorCardsComponent.onFiltersChange(filters);
    }
  }
}
