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
    location: LocationEnum;
    password?: string;
}

export interface IStep3 {
    jobTitle: string;
    workedAt: string;
    experienceYears: number;
    link?: string;
}
[];

export interface IStep4 {
    skills: string[];
    tools: string[];
    story?: string;
    reason?: string;
}

export interface IStep5 {
    mentor: {
        timeToSpend: number;
        pricePerHour: number;
        numberOfMentees: number;
    };
    mentee: {
        menteorValue: string[];
        communicationType: string;
        feedbackStyle: string;
    };
}
