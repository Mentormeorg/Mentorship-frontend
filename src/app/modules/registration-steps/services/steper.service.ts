import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageKeys } from '@core/enums';
import { getStorageItem, setStorage } from '@core/utils/storage.utils';
import { BehaviorSubject } from 'rxjs';
import { IStepsData } from '../models/interfaces/steps.interface';

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

        if (this.getCurrentStepIndex()) {
            this.currentStep$.next(this.getCurrentStepIndex() + 1);
        }

        const currentStep = this.currentStep$.value;
        console.log(currentStep, currentLinkIndex);
        if (currentLinkIndex > currentStep - 1) {
            const nextRouterLink = `${this.baseRegistrationStepsUrl}${
                this.stepsItems[this.currentStep$.value - 1].routerLink
            }`;
            this.router.navigate([nextRouterLink]);
        } else {
            this.currentStep$.next(currentLinkIndex + 1);
        }
    }

    private getCurrentStepIndex(): number {
        this.stepsData = getStorageItem<Array<IStepsData['stepsData']>>(
            StorageKeys.STEPS_DATA
        );

        if (Object.keys(this.stepsData).length > 0) {
            return this.stepsData.length - 1;
        } else {
            this.stepsData = [];
            return 0;
        }
    }

    private navigateToStep() {
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
    ): Array<IStepsData['stepsData']> {
        if (this.currentStep$.value < this.totalSteps) {
            console.log('next');
            this.currentStep$.next(this.currentStep$.value + 1);
            this.stepsData.push(stepData);
            setStorage(StorageKeys.STEPS_DATA, this.stepsData);
            this.navigateToStep();
        }
        console.log(this.stepsData);
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
            this.navigateToStep();
        }
        console.log(this.stepsData);
        return this.stepsData;
    }

    public submitForm() {
        console.log();
    }
}
