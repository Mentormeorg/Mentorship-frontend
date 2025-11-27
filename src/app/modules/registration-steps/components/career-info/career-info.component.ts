import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IExperince,
  IStep3,
  IStepsData,
} from '@modules/registration-steps/models/interfaces/steps.interface';
import { SteperService } from '@modules/registration-steps/services/steper.service';
import { getValidationErrorMessage } from '@shared/utils/validation.utils';

@Component({
  selector: 'app-career-info',
  templateUrl: './career-info.component.html',
  styleUrls: ['./career-info.component.scss'],
})
export class CareerInfoComponent {
  steprSerivce: SteperService = inject(SteperService);
  fb: FormBuilder = inject(FormBuilder);

  experincesForm!: FormGroup;

  constructor() {
    this.experincesForm = this.fb.group({
      portofolio: new FormControl<string | null>(
        null
      ),
      experinces: this.fb.array([]),
    });
    this.experincesForm.patchValue(this.steprSerivce.stepsData[2]);
    (this.steprSerivce.stepsData[2] as IStep3)?.experinces.forEach(
      (experince: IExperince) => {
        this.addExperince(
          experince.jobtitle,
          experince.workedat,
          experince.experienceyears
        );
      }
    );
    if (this.experinces.length === 0) this.addExperince();
  }

  get experinces(): FormArray {
    return this.experincesForm.get('experinces') as FormArray;
  }

  addExperince(
    jobtitle: string | null = null,
    workedat: string | null = null,
    experienceyears: number | null = null
  ) {
    const experinceControls = this.fb.group({
      jobtitle: new FormControl<string | null>(
        jobtitle,
        Validators.required
      ),
      workedat: new FormControl<string | null>(
        workedat,
        Validators.required
      ),
      experienceyears: new FormControl<number | null>(
        experienceyears,
        Validators.required
      ),
    });

    this.experinces.push(experinceControls);
  }

  nextStep($event?: IStepsData['stepsData']) {
    if (this.experincesForm.invalid) {
      this.experincesForm.markAllAsTouched();
      return;
    }
    this.steprSerivce.nextStep(this.experincesForm.value);
  }

  prevStep() {
    this.steprSerivce.previousStep();
  }

  deleteExperince(i: number) {
    this.experinces.removeAt(i);
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.experincesForm.get(controlName);
    const fieldNames: { [key: string]: string } = {
      portofolio: 'Portfolio'
    };
    return getValidationErrorMessage(control, fieldNames[controlName]);
  }

  getExperienceErrorMessage(index: number, controlName: string): string | null {
    const experienceGroup = this.experinces.at(index) as FormGroup;
    const control = experienceGroup?.get(controlName);
    const fieldNames: { [key: string]: string } = {
      jobtitle: 'Job title',
      workedat: 'Worked at',
      experienceyears: 'Experience years'
    };
    return getValidationErrorMessage(control, fieldNames[controlName]);
  }
}
