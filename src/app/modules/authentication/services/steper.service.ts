import { Injectable } from '@angular/core';
import { StorageKeys } from '@core/enums';
import { setStorage } from '@core/utils/storage.utils';
import { IStepsData } from '../models/interfaces/steps.interface';

@Injectable({
    providedIn: 'root',
})
export class SteperService {
    totalSteps: number | undefined = undefined;
    currentStep = 0;

    stepsData: Array<IStepsData['stepsData']> = [];

    nextStep(
        stepData: IStepsData['stepsData']
    ): Array<IStepsData['stepsData']> {
        this.currentStep + 1 === this.totalSteps
            ? null
            : (this.currentStep += 1);
        this.stepsData.push(stepData);
        setStorage(StorageKeys.STEPS_DATA, this.stepsData);
        return this.stepsData;
    }

    previousStep(): Array<IStepsData['stepsData']> {
        this.currentStep - 1 < 0 ? null : (this.currentStep -= 1);
        this.stepsData.pop();
        setStorage(StorageKeys.STEPS_DATA, this.stepsData);
        return this.stepsData;
    }

    // handleSocialAuthToken(token: string) {
    //     //TODO: handle social auth token
    // }
}
