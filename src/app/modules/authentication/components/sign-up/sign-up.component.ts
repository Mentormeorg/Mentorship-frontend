import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthBaseComponent } from '../auth-base/auth-base.component';
import { getValidationErrorMessage } from '@shared/utils/validation.utils';
import { matchInputsValidator, passwordStrengthValidator } from '@shared/validators';
import { AuthProviderEnum } from '@core/enums';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: false,
})
export class SignUpComponent extends AuthBaseComponent {
  public signupForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;
  public isLoading: boolean = false;
  public isSocialLoading: boolean = false;

  constructor() {
    super();

    this.signupForm = this.fb.group(
      {
        email: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        }),
        password: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, passwordStrengthValidator()],
        }),
        confirmPassword: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      },
      {
        validators: matchInputsValidator('password', 'confirmPassword'),
      }
    );
  }

  public continueWithSocial(provider: AuthProviderEnum): void {
    this.isSocialLoading = true;
    this.authService
      .socialAuth(provider)
      .pipe(finalize(() => (this.isSocialLoading = false)))
      .subscribe({
        error: error => {
          console.error('Social sign-up error:', error);
        },
      });
  }

  public registerWithEmail(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.signupForm.getRawValue();

    this.isLoading = true;
    this.authService
      .register({
        email,
        password,
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: success => {
          if (success) {
            this.signupForm.reset({
              email: '',
              password: '',
              confirmPassword: '',
            });
          }
        },
        error: error => {
          console.error('Sign-up error:', error);
        },
      });
  }

  public getErrorMessage(controlName: string): string | null {
    const control = this.signupForm.get(controlName);
    const fieldNames: Record<string, string> = {
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
    };
    return getValidationErrorMessage(control, fieldNames[controlName]);
  }
}
