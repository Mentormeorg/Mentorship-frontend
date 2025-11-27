/**
 * Authentication service messages constants
 * Centralized location for all authentication-related user messages
 */

export const AUTH_MESSAGES = {
  // Success messages
  SUCCESS: {
    LOGIN: 'Login successful! Welcome back.',
    REGISTRATION: 'Verification email sent! Please check your inbox.',
    PASSWORD_RESET_EMAIL: 'Password reset email sent! Please check your inbox.',
    PASSWORD_RESET: 'Password reset successfully! You can now sign in with your new password.',
    VERIFICATION_EMAIL: 'Verification email sent! Please check your inbox.',
    REGISTRATION_COMPLETE: 'Registration completed! You now have full access.',
  },

  // Error messages
  ERROR: {
    LOGIN_FAILED: 'Login Failed',
    LOGOUT_FAILED: 'Logout Failed',
    REGISTRATION_FAILED: 'Registration Failed',
    EMAIL_PASSWORD_REQUIRED: 'Email and password are required',
    PASSWORD_RESET_FAILED: 'Password Reset Failed',
    RESEND_VERIFICATION_FAILED: 'Resend Verification Failed',
    INVALID_AUTH_PROVIDER: 'Invalid authentication provider',
    SOCIAL_AUTH_FAILED: 'Social Authentication Failed',
    REGISTRATION_COMPLETE_FAILED: 'Registration Completion Failed',
    SIGN_IN_REQUIRED: 'You need to be signed in to complete registration.',
    AUTH_INITIALIZATION_FAILED: 'Auth Initialization Failed',
  },

  // Success titles
  TITLES: {
    LOGIN_SUCCESS: 'Login Success',
    REGISTRATION_SUCCESS: 'Registration Success',
    EMAIL_SENT: 'Email Sent',
    PASSWORD_RESET_SUCCESS: 'Password Reset Success',
    ONBOARDING_COMPLETE: 'Onboarding Complete',
  },
} as const;

