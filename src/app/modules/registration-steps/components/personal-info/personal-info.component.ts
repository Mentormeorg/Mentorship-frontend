import { Component, OnInit, inject } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { LocationEnum } from '@core/enums/location.enum';
import { IStep2 } from '@modules/registration-steps/models/interfaces/steps.interface';
import { SteperService } from '@modules/registration-steps/services/steper.service';

@Component({
    selector: 'app-personal-info',
    templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
    steprSerivce: SteperService = inject(SteperService);

    formBuilder: FormBuilder = inject(FormBuilder);
    personalInfoForm: FormGroup = this.formBuilder.group({
        fullname: new FormControl<IStep2['fullname'] | null>(
            null,
            Validators.required
        ),
        phoneNumber: new FormControl<IStep2['phonebumber'] | null>(
            null,
            Validators.required
        ),
        gender: new FormControl<IStep2['gender'] | null>(
            null,
            Validators.required
        ),
        city: new FormControl<IStep2['location'] | null>(
            null,
            Validators.required
        ),
        password: new FormControl<IStep2['password'] | null>(
            null,
            Validators.required
        ),
    });
    cities: IStep2['location'][] = Object.values(LocationEnum).map((city) => ({
        name: city,
        code: city,
    }));

    ngOnInit(): void {
        this.steprSerivce.currentStep$.subscribe((step) => {
            if (step === 2 && this.steprSerivce.stepsData[1]) {
                this.personalInfoForm.patchValue(
                    this.steprSerivce.stepsData[1]
                );
            }
        });
    }

    nextStep() {
        if (this.personalInfoForm.valid)
            this.steprSerivce.nextStep(this.personalInfoForm.value);
    }

    prevStep() {
        this.steprSerivce.previousStep();
    }
}
