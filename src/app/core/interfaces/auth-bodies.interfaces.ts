import { RolesEnum } from '@core/enums/roles.enum';

export interface ILoginBody {
    email: string;
    password: string;
}

export interface IRegisterBody {
    fullName: string;
    email: string;
    password: string;
    role: RolesEnum;
    phoneNumber: string;
}

export interface IForgetPasswordBody {
    email: string;
}

export interface IResetPasswordBody {
    newPassword: string;
    token?: string;
}
