import { Component, inject, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IStep5,
} from '@modules/registration-steps/models/interfaces/steps.interface';
import { SteperService } from '@modules/registration-steps/services/steper.service';
import { getValidationErrorMessage } from '@shared/utils/validation.utils';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PreferenceComponent {
  steprSerivce: SteperService = inject(SteperService);

  formBuilder: FormBuilder = inject(FormBuilder);

  perferenceForm: FormGroup = this.formBuilder.group({
    timeToSpend: new FormControl<IStep5['timeToSpend'] | null>(1, [
      Validators.required,
      Validators.min(1),
    ]),
    pricePerHour: new FormControl<IStep5['pricePerHour'] | null>(1, [
      Validators.required,
      Validators.min(1),
    ]),
    numberOfMentees: new FormControl<
      IStep5['numberOfMentees'] | null
    >(1, [Validators.required, Validators.min(1)]),
  });

  finish() {
    if (this.perferenceForm.invalid) {
      this.perferenceForm.markAllAsTouched();
      return;
    }
    this.steprSerivce.finish(this.perferenceForm.value);
  }

  prevStep() {
    this.steprSerivce.previousStep();
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.perferenceForm.get(controlName);
    const fieldNames: { [key: string]: string } = {
      timeToSpend: 'Time to spend',
      pricePerHour: 'Price per hour',
      numberOfMentees: 'Number of mentees'
    };
    return getValidationErrorMessage(control, fieldNames[controlName]);
  }
}
