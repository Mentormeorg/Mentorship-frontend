import { GenderEnum, RolesEnum, SeniorityEnum } from '@core/enums';
import { LocationEnum } from '@core/enums/location.enum';

export interface IStepsData {
  stepsData: IStep1 | IStep2 | IStep3 | IStep4 | IStep5;
}

export interface IStep1 {
  role: RolesEnum;
}

export interface IStep2 {
  fullName: string;
  gender: GenderEnum;
  location: LocationEnum;
  phoneNumber: string;
  password?: string;
}

export interface IStep3 {
  portfolio: string | null;
  totalYearsOfExperience: number | null;
  experinces: IExperince[];
}

export interface IExperince {
  jobTitle: string | null | undefined;
  workedAt: string | null;
  experienceYears: number | null;
  seniorityLevel: SeniorityEnum | null;
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
