import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { PATHS } from '@core/paths';

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

  ngOnInit(): void {
    // Handle OAuth callback - Supabase handles the session automatically
    // Check for hash fragments in URL (OAuth callback contains tokens)
    this.handleOAuthCallback();
  }

  private handleOAuthCallback(): void {
    // Get session from URL hash or existing session
    this.supabase.client.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        // OAuth callback error - redirect to sign in
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
            this.router.navigate([PATHS.DISCOVER]);
          }
        }, 5000);
      } else {
        // No session found, redirect to sign in
        this.router.navigate([PATHS.AUTH__SIGN_IN]);
      }
    }).catch(() => {
      // Failed to get session - redirect to sign in
      this.router.navigate([PATHS.AUTH__SIGN_IN]);
    });
  }
}
