import { Component, Output, inject } from '@angular/core';
import { RolesEnum } from '@core/enums';
import { SteperService } from '@modules/registration-steps/services/steper.service';
import { IStep1, IStepsData } from '../../models/interfaces/steps.interface';

@Component({
    selector: 'app-role-info',
    templateUrl: './role-info.component.html',
    styleUrls: ['./role-info.component.scss'],
})
export class RoleInfoComponent {
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
