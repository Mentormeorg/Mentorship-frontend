import { Component, ViewEncapsulation, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RolesEnum } from '@core/enums';
import { SteperService } from '@modules/registration-steps/services/steper.service';
import { IStep1, IStepsData } from '../../models/interfaces/steps.interface';

@Component({
    selector: 'app-role-info',
    templateUrl: './role-info.component.html',
    styleUrls: ['./role-info.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RoleInfoComponent {
    steprSerivce: SteperService = inject(SteperService);
    formBuilder: FormBuilder = inject(FormBuilder);
    RolesEnum = RolesEnum;
    roleForm: FormGroup = this.formBuilder.group({
        role: new FormControl<RolesEnum>(RolesEnum.MENTEE, {
            nonNullable: true,
        }),
    });
    stepeData: IStep1 = {
        role: RolesEnum.MENTEE,
    };
    nextStep($event?: IStepsData['stepsData']) {
        this.steprSerivce.nextStep(this.roleForm.value);
    }

    prevStep() {
        this.steprSerivce.previousStep();
    }
}
