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
} from '@modules/registration-steps/models/interfaces/steps.interface';
import { SteperService } from '@modules/registration-steps/services/steper.service';
import { getValidationErrorMessage } from '@shared/utils/validation.utils';
import { SeniorityEnum } from '@core/enums';

@Component({
  selector: 'app-career-info',
  templateUrl: './career-info.component.html',
  styleUrls: ['./career-info.component.scss'],
})
export class CareerInfoComponent {
  // ========== Generic Dependencies (Shared across step components) ==========
  steprSerivce: SteperService = inject(SteperService);
  fb: FormBuilder = inject(FormBuilder);

  // ========== Component-Specific Properties ==========
  // Form
  experincesForm!: FormGroup;

  // Data/Configuration
  seniorityLevels = Object.values(SeniorityEnum).map(level => ({
    label: this.formatSeniorityLabel(level),
    value: level
  }));

  // ========== Constructor ==========
  constructor() {
    this.initializeForm();
    this.loadExistingData();
  }

  // ========== Getters ==========
  get experinces(): FormArray {
    return this.experincesForm.get('experinces') as FormArray;
  }

  // ========== Generic Step Navigation Methods (Shared across step components) ==========
  nextStep(): void {
    if (this.experincesForm.invalid) {
      this.experincesForm.markAllAsTouched();
      return;
    }
    this.steprSerivce.nextStep(this.experincesForm.value);
  }

  prevStep(): void {
    this.steprSerivce.previousStep();
  }

  // ========== Component-Specific Form Management Methods ==========
  addExperince(
    jobTitle: string | null = null,
    workedAt: string | null = null,
    experienceYears: number | null = null,
    seniorityLevel: SeniorityEnum | null = null
  ): void {
    const experinceControls = this.fb.group({
      jobTitle: new FormControl<string | null>(
        jobTitle,
        Validators.required
      ),
      workedAt: new FormControl<string | null>(
        workedAt,
        Validators.required
      ),
      experienceYears: new FormControl<number | null>(
        experienceYears,
        Validators.required
      ),
      seniorityLevel: new FormControl<SeniorityEnum | null>(
        seniorityLevel,
        Validators.required
      ),
    });

    this.experinces.push(experinceControls);
  }

  deleteExperince(i: number): void {
    this.experinces.removeAt(i);
  }

  // ========== Generic Validation Methods (Shared pattern across step components) ==========
  getErrorMessage(controlName: string): string | null {
    const control = this.experincesForm.get(controlName);
    const fieldNames: { [key: string]: string } = {
      portfolio: 'Portfolio',
      totalYearsOfExperience: 'Total years of experience'
    };
    return getValidationErrorMessage(control, fieldNames[controlName]);
  }

  getExperienceErrorMessage(index: number, controlName: string): string | null {
    const experienceGroup = this.experinces.at(index) as FormGroup;
    const control = experienceGroup?.get(controlName);
    const fieldNames: { [key: string]: string } = {
      jobTitle: 'Job title',
      workedAt: 'Worked at',
      experienceYears: 'Experience years',
      seniorityLevel: 'Seniority level'
    };
    return getValidationErrorMessage(control, fieldNames[controlName]);
  }

  // ========== Private Helper Methods ==========
  private initializeForm(): void {
    this.experincesForm = this.fb.group({
      totalYearsOfExperience: new FormControl<number | null>(
        null,
        Validators.required
      ),
      experinces: this.fb.array([]),
    });
  }

  private loadExistingData(): void {
    this.experincesForm.patchValue(this.steprSerivce.stepsData[2]);
    (this.steprSerivce.stepsData[2] as IStep3)?.experinces.forEach(
      (experince: IExperince) => {
        this.addExperince(
          experince.jobTitle,
          experince.workedAt,
          experince.experienceYears,
          experince.seniorityLevel
        );
      }
    );
    if (this.experinces.length === 0) this.addExperince();
  }

  private formatSeniorityLabel(level: SeniorityEnum): string {
    return level
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }
}
