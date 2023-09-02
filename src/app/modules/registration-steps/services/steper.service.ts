import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageKeys } from '@core/enums';
import { getStorageItem, setStorage } from '@core/utils/storage.utils';
import { BehaviorSubject } from 'rxjs';
import { IStep5, IStepsData } from '../models/interfaces/steps.interface';

@Injectable({
    providedIn: 'root',
})
export class SteperService {
    private readonly _initialStep: number = 1;
    private readonly baseRegistrationStepsUrl = 'auth/registeration-steps/';
    private router: Router = inject(Router);

    public stepsData: Array<IStepsData['stepsData']> = [];
    public currentStep$: BehaviorSubject<number> = new BehaviorSubject<number>(
        this._initialStep
    );
    public stepsItems: Array<{
        lable: string;
        routerLink: string;
        intro: {
            header: string;
            description: string;
        };
    }> = [];
    public totalSteps = 0;

    constructor() {
        this.stepsItems = [
            {
                lable: 'Role Info',
                routerLink: 'role-info',
                intro: {
                    header: 'Sign up',
                    description:
                        'Lorem ipsum dolor sit amet consectetur. Nec aenean pellentesque est porta gravida aliquam sed.',
                },
            },
            {
                lable: 'Personal Info',
                routerLink: 'personal-info',
                intro: {
                    header: 'Personal information ',
                    description:
                        'Lorem ipsum dolor sit amet consectetur. Nec aenean pellentesque est porta gravida aliquam sed.',
                },
            },
            {
                lable: 'Career Info',
                routerLink: 'career-info',
                intro: {
                    header: 'Career information ',
                    description:
                        'Lorem ipsum dolor sit amet consectetur. Nec aenean pellentesque est porta gravida aliquam sed.',
                },
            },
            {
                lable: 'Biography',
                routerLink: 'biography',
                intro: {
                    header: 'My biography',
                    description:
                        'Lorem ipsum dolor sit amet consectetur. Nec aenean pellentesque est porta gravida aliquam sed.',
                },
            },
            {
                lable: 'Preference',
                routerLink: 'preference',
                intro: {
                    header: 'Mentoring preference ',
                    description:
                        'Lorem ipsum dolor sit amet consectetur. Nec aenean pellentesque est porta gravida aliquam sed.',
                },
            },
        ];
        this.totalSteps = this.stepsItems.length;
        const currentLink = this.router.url.split('/').at(-1);
        const currentLinkIndex = this.stepsItems.findIndex(
            (item) => item.routerLink === currentLink
        );

        this.resetToLastStep();

        if (currentLinkIndex + 1 > this.currentStep$.value) {
            this.navigateToLastStep();
        } else if (currentLinkIndex === this.currentStep$.value - 1) {
            return;
        } else {
            this.stepsData = this.stepsData.slice(0, currentLinkIndex);
            setStorage(StorageKeys.STEPS_DATA, this.stepsData);
            this.resetToLastStep();
        }
    }

    private resetToLastStep() {
        this.stepsData = getStorageItem<Array<IStepsData['stepsData']>>(
            StorageKeys.STEPS_DATA
        );
        this.currentStep$.next(this.getCurrentStepIndex() + 1);
    }

    private getCurrentStepIndex(): number {
        if (this.stepsData instanceof Array) {
            return this.stepsData.length > this.totalSteps
                ? this.stepsData.length - 1
                : this.stepsData.length;
        } else {
            return 0;
        }
    }

    private navigateToLastStep() {
        const nextRouterLink = `${this.baseRegistrationStepsUrl}${
            this.stepsItems[this.currentStep$.value - 1].routerLink
        }`;
        this.router.navigate([nextRouterLink]);
    }

    /**
     * Executes the next step in the process.
     *
     * @param {IStepsData['stepsData']} stepData - The step data to be added to the steps array.
     * @return {Array<IStepsData['stepsData']>} The updated steps array.
     */
    public nextStep(
        stepData: IStepsData['stepsData']
    ): Array<IStepsData['stepsData']> | undefined {
        if (this.currentStep$.value < this.totalSteps) {
            if (!(this.stepsData instanceof Array)) this.stepsData = [];
            this.currentStep$.next(this.currentStep$.value + 1);
            this.stepsData.push(stepData);
            setStorage(StorageKeys.STEPS_DATA, this.stepsData);
            this.navigateToLastStep();
        }
        return this.stepsData;
    }

    /**
     * Decrements the current step, removes the last step's data from the
     * stepsData array, saves the updated stepsData to storage, and navigates
     * to the previous step.
     *
     * @return {Array<IStepsData['stepsData']>} The updated stepsData array.
     */
    public previousStep(): Array<IStepsData['stepsData']> {
        if (this.currentStep$.value > this._initialStep) {
            this.currentStep$.next(this.currentStep$.value - 1);
            this.stepsData.pop();
            setStorage(StorageKeys.STEPS_DATA, this.stepsData);
            this.navigateToLastStep();
        }
        return this.stepsData;
    }

    public finish(stepData: IStep5) {
        this.stepsData.push(stepData);
        setStorage(StorageKeys.STEPS_DATA, this.stepsData);

        // submit form
    }
}
