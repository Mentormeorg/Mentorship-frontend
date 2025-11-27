import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RolesEnum, StorageKeys } from '@core/enums';
import { PATHS } from '@core/paths';
import { AuthenticationService } from '@core/services/authentication.service';
import {
  getStorageItem,
  removeStorageItem,
  setStorage,
} from '@core/utils/storage.utils';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  IStep1,
  IStep5,
  IStepsData,
} from '../models/interfaces/steps.interface';

@Injectable({
  providedIn: 'root',
})
export class SteperService {
  private readonly _initialStep: number = 1;
  private readonly baseRegistrationStepsUrl =
    'auth/registeration-steps/';
  private readonly _baseSteps: Array<{
    lable: string;
    routerLink: string;
    intro: {
      header: string;
      description?: string;
    };
  }> = [
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
  ];
  private readonly _mentorPreferenceStep = {
    lable: 'Preference',
    routerLink: 'preference',
    intro: {
      header: 'Mentoring preference ',
      description:
        'Lorem ipsum dolor sit amet consectetur. Nec aenean pellentesque est porta gravida aliquam sed.',
    },
  };

  private router: Router = inject(Router);
  private _authenticationService: AuthenticationService = inject(
    AuthenticationService
  );
  public totalSteps = 0;

  public stepsData: Array<IStepsData['stepsData']> = [];
  public currentStep$: BehaviorSubject<number> =
    new BehaviorSubject<number>(this._initialStep);
  public stepsItems: Array<{
    lable: string;
    routerLink: string;
    intro: {
      header: string;
      description?: string;
    };
  }> = [];

  constructor() {
    this.syncStepsFromStorage();
    this.currentStep$.next(this.getCurrentStepIndex() + 1);

    const currentLink = this.router.url.split('/').at(-1);
    const currentLinkIndex = this.stepsItems.findIndex(
      item => item.routerLink === currentLink
    );

    if (currentLinkIndex === -1) {
      this.navigateToLastStep();
      return;
    }

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
    this.syncStepsFromStorage();
    this.currentStep$.next(this.getCurrentStepIndex() + 1);
  }

  private getCurrentStepIndex(): number {
    const completedSteps = this.stepsData.length;
    return Math.min(completedSteps, Math.max(this.totalSteps - 1, 0));
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
      this.stepsData[this.currentStep$.value - 2] = stepData;
      this.stepsData = this.stepsData.filter(
        (item): item is IStepsData['stepsData'] =>
          item !== undefined && item !== null
      );
      setStorage(StorageKeys.STEPS_DATA, this.stepsData);

      if (this.isRoleStep(stepData)) {
        this.configureStepsForRole(stepData.role);
      }

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
      this.navigateToLastStep();
    }
    return this.stepsData;
  }

  public finish(stepData: IStep5) {
    this.stepsData.push(stepData);
    setStorage(StorageKeys.STEPS_DATA, this.stepsData);

    this._authenticationService
      .markRegistrationComplete(this.stepsData)
      .pipe(take(1))
      .subscribe(success => {
        if (success) {
          removeStorageItem(StorageKeys.STEPS_DATA);
          this.router.navigate([PATHS.DISCOVER]);
        }
      });
  }

  private syncStepsFromStorage(): void {
    this.stepsData =
      getStorageItem<Array<IStepsData['stepsData']>>(StorageKeys.STEPS_DATA) ||
      [];
    this.configureStepsForRole(this.getStoredRole());
  }

  private configureStepsForRole(role: RolesEnum | null): void {
    this.stepsItems = [...this._baseSteps];
    if (role === RolesEnum.MENTOR) {
      this.stepsItems.push(this._mentorPreferenceStep);
    }
    this.totalSteps = this.stepsItems.length;
    this.trimStepsDataToAvailableSteps();
  }

  private trimStepsDataToAvailableSteps(): void {
    const maxEntries = this.totalSteps;
    if (this.stepsData.length > maxEntries) {
      this.stepsData = this.stepsData.slice(0, maxEntries);
      setStorage(StorageKeys.STEPS_DATA, this.stepsData);
    }
    if (this.currentStep$.value > this.totalSteps) {
      this.currentStep$.next(this.totalSteps);
    }
  }

  private getStoredRole(): RolesEnum | null {
    const storedRole = this.stepsData[0] as IStep1 | undefined;
    return storedRole?.role ?? null;
  }

  private isRoleStep(
    stepData: IStepsData['stepsData']
  ): stepData is IStep1 {
    return !!stepData && 'role' in stepData;
  }
}
