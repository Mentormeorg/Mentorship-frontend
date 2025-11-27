import { AuthProviderEnum } from '@core/enums/auth-provider.enum';
import { GenderEnum } from '@core/enums/gender.enum';
import { RolesEnum } from '@core/enums/roles.enum';
import { IStepsData } from '@modules/registration-steps/models/interfaces/steps.interface';

export interface IUser {
  id: string; // Changed from number to string for Supabase UUID
  email: string;
  fullName: string;
  gender?: GenderEnum;
  dateOFBirth?: string;
  summary?: string;
  isOAuth: boolean;
  isVerified: boolean;
  idToken?: string;
  role: RolesEnum;
  oAuthType?: AuthProviderEnum;
  phoneNumber: string;
  createdAt: string;
  accessToken: string;
  refreshToken: string;
  hasCompletedRegistration: boolean;
  registrationData?: IStepsData['stepsData'][];
}
