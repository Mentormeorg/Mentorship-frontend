export interface ILoginBody {
  email: string;
  password: string;
}

export interface IRegisterBody {
  email: string;
  password: string;
}

export interface IForgetPasswordBody {
  email: string;
}

export interface IResetPasswordBody {
  newPassword: string;
  token?: string;
}
