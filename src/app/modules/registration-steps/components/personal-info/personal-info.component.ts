import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocationEnum } from '@core/enums/location.enum';
import { IStep2 } from '@modules/registration-steps/models/interfaces/steps.interface';
import { SteperService } from '@modules/registration-steps/services/steper.service';
import { getValidationErrorMessage } from '@shared/utils/validation.utils';
import { phoneNumberValidator } from '@shared/validators';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
  steprSerivce: SteperService = inject(SteperService);

  formBuilder: FormBuilder = inject(FormBuilder);
  personalInfoForm: FormGroup = this.formBuilder.group({
    fullName: new FormControl<IStep2['fullName'] | null>(
      null,
      Validators.required
    ),
    phoneNumber: new FormControl<IStep2['phoneNumber'] | null>(
      null,
      [Validators.required, phoneNumberValidator()]
    ),
    gender: new FormControl<IStep2['gender'] | null>(
      null,
      Validators.required
    ),
    city: new FormControl<IStep2['location'] | null>(
      null,
      Validators.required
    )
  });

  cities: LocationEnum[] = Object.values(LocationEnum);

  ngOnInit(): void {
    this.steprSerivce.currentStep$.subscribe(step => {
      if (step === 2 && this.steprSerivce.stepsData[1]) {
        const stepData = this.steprSerivce.stepsData[1] as IStep2;
        this.personalInfoForm.patchValue({
          ...stepData,
          city: stepData.location,
        });
      }
    });
  }

  nextStep() {
    if (this.personalInfoForm.invalid) {
      this.personalInfoForm.markAllAsTouched();
      return;
    }
    const formValue = this.personalInfoForm.value;
    // Remove hyphens and other formatting from phone number before storing
    const sanitizedPhoneNumber = formValue.phoneNumber?.replace(/[-\s()]/g, '') || '';
    const stepData: IStep2 = {
      fullName: formValue.fullName,
      gender: formValue.gender,
      location: formValue.city,
      phoneNumber: sanitizedPhoneNumber,
      password: formValue.password,
    };
    this.steprSerivce.nextStep(stepData);
  }

  prevStep() {
    this.steprSerivce.previousStep();
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.personalInfoForm.get(controlName);
    const fieldNames: { [key: string]: string } = {
      fullName: 'Full name',
      phoneNumber: 'Phone number',
      gender: 'Gender',
      city: 'City',
    };
    return getValidationErrorMessage(control, fieldNames[controlName]);
  }
}
