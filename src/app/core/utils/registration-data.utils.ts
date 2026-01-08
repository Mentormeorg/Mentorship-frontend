import { IStepsData, IStep2 } from '@modules/registration-steps/models/interfaces/steps.interface';

/**
 * Sanitize phone number in registrationData (remove hyphens, spaces, parentheses)
 */
export function sanitizeRegistrationData(
  registrationData?: IStepsData['stepsData'][]
): IStepsData['stepsData'][] | undefined {
  return registrationData?.map((step, index) => {
    if (index === 1 && step && typeof step === 'object' && 'phoneNumber' in step) {
      // Step 2 contains phoneNumber - sanitize it
      const step2 = step as IStep2;
      return {
        ...step2,
        phoneNumber: step2.phoneNumber?.replace(/[-\s()]/g, '') || '',
      } as IStep2;
    }
    return step;
  }) as IStepsData['stepsData'][];
}
