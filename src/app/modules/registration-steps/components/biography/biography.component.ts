import { Component, OnInit, inject } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { RolesEnum } from '@core/enums';
import {
    IStep4,
    IStepsData,
} from '@modules/registration-steps/models/interfaces/steps.interface';
import { SteperService } from '@modules/registration-steps/services/steper.service';
import { IStep1 } from '../../models/interfaces/steps.interface';

@Component({
    selector: 'app-biography',
    templateUrl: './biography.component.html',
    styleUrls: ['./biography.component.scss'],
})
export class BiographyComponent implements OnInit {
    steprSerivce: SteperService = inject(SteperService);
    formBuilder: FormBuilder = inject(FormBuilder);
    userRole: RolesEnum | undefined = undefined;
    RolesEnum = RolesEnum;
    biographyForm: FormGroup = this.formBuilder.group({
        skills: new FormControl<IStep4['skills'] | null>(
            null,
            Validators.required
        ),
        tools: new FormControl<IStep4['tools'] | null>(
            null,
            Validators.required
        ),
        careerStory: new FormControl<IStep4['story'] | null>(null),
    });

    ngOnInit(): void {
        this.steprSerivce.currentStep$.subscribe((step) => {
            if (step === 4 && this.steprSerivce.stepsData[3]) {
                this.biographyForm.patchValue(this.steprSerivce.stepsData[3]);
            }
        });

        this.userRole = (this.steprSerivce.stepsData[0] as IStep1).role;
    }
    nextStep($event?: IStepsData['stepsData']) {
        //check if mentor Got to next step else finish
        this.userRole = (this.steprSerivce.stepsData[0] as IStep1).role;
        console.log(this.userRole);
        if (
            (this.steprSerivce.stepsData[0] as IStep1).role === RolesEnum.MENTOR
        ) {
            if (this.biographyForm.valid)
                this.steprSerivce.nextStep(this.biographyForm.value);
        } else {
            this.steprSerivce.finish(this.biographyForm.value);
        }
    }

    prevStep() {
        this.steprSerivce.previousStep();
    }
}
