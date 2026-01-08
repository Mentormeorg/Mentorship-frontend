import { SupabaseClient } from '@supabase/supabase-js';
import { from, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface OAuthUserInput {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  email_confirmed_at?: string | null;
  phone?: string;
  created_at?: string;
}

/**
 * Sync OAuth user profile to profiles_table
 */
export function syncOAuthUserProfile(
  client: SupabaseClient,
  user: OAuthUserInput
): Observable<unknown> {
  // Extract OAuth user data
  const fullName = (user.user_metadata?.['full_name'] as string) ||
    (user.user_metadata?.['name'] as string) ||
    (user.user_metadata?.['user_name'] as string) ||
    (user.user_metadata?.['preferred_username'] as string) ||
    user.email?.split('@')[0] ||
    '';

  const avatarUrl = (user.user_metadata?.['avatar_url'] as string) ||
    (user.user_metadata?.['picture'] as string) ||
    (user.user_metadata?.['avatar_url'] as string) ||
    '';

  // Upsert profile to profiles_table
  return from(
    client
      .from('profiles_table')
      .upsert({
        id: user.id,
        email: user.email || '',
        full_name: fullName,
        avatar_url: avatarUrl,
        phone_number: user.phone || null,
        role: (user.user_metadata?.['role'] as string) || 'MENTEE',
        registration_completed: Boolean(
          user.user_metadata?.['registrationCompleted']
        ),
        created_at: user.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      })
  ).pipe(
    catchError(() => {
      // Error logged silently - don't block authentication if profile sync fails
      return of(null);
    })
  );
}
