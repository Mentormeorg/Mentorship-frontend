import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { PATHS } from '@core/paths';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-oauth-callback',
  template: `
    <div class="oauth-callback-container">
      <div class="loading-spinner">
        <p>Completing authentication...</p>
      </div>
    </div>
  `,
  styles: [`
    .oauth-callback-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .loading-spinner {
      text-align: center;
    }
  `],
  standalone: false
})
export class OAuthCallbackComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private errorHandling = inject(ErrorHandlingService);

  ngOnInit(): void {
    // Handle OAuth callback - Supabase handles the session automatically
    // Check for hash fragments in URL (OAuth callback contains tokens)
    this.handleOAuthCallback();
  }

  private handleOAuthCallback(): void {
    // First, check for error query parameters (from URL query string)
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      const error = params['error'];
      const errorDescription = params['error_description'];

      if (error) {
        // OAuth callback error - show error and redirect to sign in
        const errorMessage = errorDescription
          ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
          : 'Authentication failed. Please try again.';

        this.errorHandling.handleError(errorMessage, 'Authentication Error');
        this.router.navigate([PATHS.AUTH__SIGN_IN], {
          queryParams: { error: 'oauth_failed' }
        });
        return;
      }

      // Also check for error in hash fragments (OAuth sometimes uses hash)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashError = hashParams.get('error');
      const hashErrorDescription = hashParams.get('error_description');

      if (hashError) {
        const errorMessage = hashErrorDescription
          ? decodeURIComponent(hashErrorDescription.replace(/\+/g, ' '))
          : 'Authentication failed. Please try again.';

        this.errorHandling.handleError(errorMessage, 'Authentication Error');
        this.router.navigate([PATHS.AUTH__SIGN_IN], {
          queryParams: { error: 'oauth_failed' }
        });
        return;
      }

      // Get session from URL hash or existing session
      this.supabase.client.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          // OAuth callback error - redirect to sign in
          this.errorHandling.handleError('Failed to get session. Please try again.', 'Authentication Error');
          this.router.navigate([PATHS.AUTH__SIGN_IN]);
          return;
        }

        if (session) {
          // Wait for auth state change to process the session
          // The handleAuthStateChange will sync profile and navigate
          const checkInterval = setInterval(() => {
            const user = this.authService.userData.value;
            if (user) {
              clearInterval(checkInterval);
              const nextRoute = this.authService.getPostAuthenticationPath(user);
              this.router.navigate([nextRoute]);
            }
          }, 100);

          // Timeout after 5 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            const user = this.authService.userData.value;
            if (user) {
              const nextRoute = this.authService.getPostAuthenticationPath(user);
              this.router.navigate([nextRoute]);
            } else {
              // Fallback navigation
              this.errorHandling.handleError('Authentication completed but user data not found.', 'Authentication Error');
              this.router.navigate([PATHS.AUTH__SIGN_IN]);
            }
          }, 5000);
        } else {
          // No session found, redirect to sign in
          this.errorHandling.handleError('No session found. Please try signing in again.', 'Authentication Error');
          this.router.navigate([PATHS.AUTH__SIGN_IN]);
        }
      }).catch(() => {
        // Failed to get session - redirect to sign in
        this.errorHandling.handleError('Failed to process authentication. Please try again.', 'Authentication Error');
        this.router.navigate([PATHS.AUTH__SIGN_IN]);
      });
    });
  }
}
