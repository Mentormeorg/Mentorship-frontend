import { IUser } from '@core/interfaces/user.interface';
import { RolesEnum } from '@core/enums/roles.enum';
import { IStepsData } from '@modules/registration-steps/models/interfaces/steps.interface';

export interface SupabaseUserInput {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  email_confirmed_at?: string | null;
  phone?: string;
  created_at?: string;
}

export interface SessionInput {
  access_token: string;
  refresh_token?: string | null;
}

/**
 * Map Supabase user to IUser
 */
export function mapSupabaseUserToIUser(
  supabaseUser: SupabaseUserInput,
  session: SessionInput,
  isOAuth = false
): IUser {
  // For OAuth users, extract name from user_metadata (Google/GitHub provide full_name or name)
  const oAuthName = isOAuth
    ? (supabaseUser.user_metadata?.['full_name'] as string) ||
      (supabaseUser.user_metadata?.['name'] as string) ||
      (supabaseUser.user_metadata?.['user_name'] as string) ||
      (supabaseUser.user_metadata?.['preferred_username'] as string)
    : null;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    fullName:
      oAuthName ||
      (supabaseUser.user_metadata?.['full_name'] as string) ||
      (supabaseUser.user_metadata?.['name'] as string) ||
      supabaseUser.email?.split('@')[0] ||
      '',
    isOAuth,
    isVerified: !!supabaseUser.email_confirmed_at || isOAuth, // OAuth users are verified by default
    role: ((supabaseUser.user_metadata?.['role'] as string) ||
      RolesEnum.MENTEE) as RolesEnum,
    phoneNumber: supabaseUser.phone || '',
    createdAt: supabaseUser.created_at || '',
    accessToken: session.access_token,
    refreshToken: session.refresh_token || '',
    hasCompletedRegistration: Boolean(
      supabaseUser.user_metadata?.['registrationCompleted']
    ),
    registrationData: supabaseUser.user_metadata?.['registrationData'] as IStepsData['stepsData'][] | undefined,
  };
}
