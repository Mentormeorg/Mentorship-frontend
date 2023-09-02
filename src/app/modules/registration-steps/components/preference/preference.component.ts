import { Component, inject } from '@angular/core';
import {
    IStep5,
    IStepsData,
} from '@modules/registration-steps/models/interfaces/steps.interface';
import { SteperService } from '@modules/registration-steps/services/steper.service';

@Component({
    selector: 'app-preference',
    templateUrl: './preference.component.html',
    styleUrls: ['./preference.component.scss'],
})
export class PreferenceComponent {
    steprSerivce: SteperService = inject(SteperService);
    stepeData: IStep5 = {
        mentee: {
            menteorValue: [''],
            communicationType: '',
            feedbackStyle: '',
        },
    };

    finish($event?: IStepsData['stepsData']) {
        this.steprSerivce.finish(this.stepeData);
    }

    prevStep() {
        this.steprSerivce.previousStep();
    }
}
