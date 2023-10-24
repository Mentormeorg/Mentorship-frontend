import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IMentor } from '@shared/interfaces/mentor.interface';

@Component({
    selector: 'app-mentor-card',
    templateUrl: './mentor-card.component.html',
    styleUrls: ['./mentor-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MentorCardComponent {
    @Input() public mentor?: IMentor;
}
