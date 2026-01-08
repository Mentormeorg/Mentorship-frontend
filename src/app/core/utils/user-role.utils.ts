import { IUser } from '@core/interfaces/user.interface';
import { RolesEnum } from '@core/enums/roles.enum';

/**
 * Check if user has a specific role
 */
export function hasRole(user: IUser | null, role: RolesEnum): boolean {
  return user?.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: IUser | null, roles: RolesEnum[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * Check if user is a mentor
 */
export function isMentor(user: IUser | null): boolean {
  return hasRole(user, RolesEnum.MENTOR);
}

/**
 * Check if user is a mentee
 */
export function isMentee(user: IUser | null): boolean {
  return hasRole(user, RolesEnum.MENTEE);
}

/**
 * Check if user is an admin
 */
export function isAdmin(user: IUser | null): boolean {
  return hasRole(user, RolesEnum.ADMIN);
}

/**
 * Get current user role
 */
export function getCurrentRole(user: IUser | null): RolesEnum | null {
  return user?.role || null;
}
