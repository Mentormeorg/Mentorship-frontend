import { GenderEnum, RolesEnum } from '@core/enums';
import { LocationEnum } from '@core/enums/location.enum';

export interface IStepsData {
    stepsData: IStep1 | IStep2 | IStep3 | IStep4 | IStep5;
}

export interface IStep1 {
    role: RolesEnum;
}

export interface IStep2 {
    fullname: string;
    gender: GenderEnum;
    location: {
        name: LocationEnum;
        code: LocationEnum;
    };
    phonebumber: string;
    password?: string;
}

export interface IStep3 {
    portofolio: string | null;
    experinces: IExperince[];
}

export interface IExperince {
    jobtitle: string | null | undefined;
    workedat: string | null;
    experienceyears: number | null;
}

export interface IStep4 {
    skills: string[];
    tools: string[];
    story?: string;
    reason?: string;
}

export interface IStep5 {
    timeToSpend: number;
    pricePerHour: number;
    numberOfMentees: number;
}
