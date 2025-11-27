import { Component, ViewEncapsulation, inject } from '@angular/core';
import { SteperService } from '@modules/registration-steps/services/steper.service';

@Component({
  selector: 'app-registration-steps-layout',
  templateUrl: './registration-steps-layout.component.html',
  styleUrls: ['./registration-steps-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegistrationStepsLayoutComponent {
  steprSerivce: SteperService = inject(SteperService);
}
