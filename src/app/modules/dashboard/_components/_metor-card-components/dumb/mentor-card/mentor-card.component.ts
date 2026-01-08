import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { IMentor } from '@shared/interfaces/mentor.interface';

@Component({
  selector: 'app-mentor-card',
  templateUrl: './mentor-card.component.html',
  styleUrls: ['./mentor-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MentorCardComponent {
  @Input() public mentor?: IMentor;
  imageError = false;

  constructor(private cdr: ChangeDetectorRef) {}

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
    this.imageError = true;
    this.cdr.markForCheck();
  }
}
