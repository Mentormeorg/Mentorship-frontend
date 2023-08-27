import { Component, inject } from '@angular/core';
import { RolesEnum } from '@core/enums';
import {
    IStep1,
    IStepsData,
} from '@modules/registration-steps/models/interfaces/steps.interface';
import { SteperService } from '@modules/registration-steps/services/steper.service';

@Component({
    selector: 'app-personal-info',
    templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent {
    steprSerivce: SteperService = inject(SteperService);
    stepeData: IStep1 = {
        role: RolesEnum.MENTEE,
    };

    nextStep($event?: IStepsData['stepsData']) {
        this.steprSerivce.nextStep(this.stepeData);
    }

    prevStep() {
        this.steprSerivce.previousStep();
    }
}
