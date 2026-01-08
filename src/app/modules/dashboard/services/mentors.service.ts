import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { IMentor } from '@shared/interfaces/mentor.interface';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { countryCode } from 'flag-pipe/lib/types';
import { RolesEnum } from '@core/enums/roles.enum';
// Removed unused imports - now using normalized columns instead of registration_data

export interface IMentorFilters {
  text?: string;
  country?: string;
  rate?: string;
  experience?: string;
  price?: [number, number];
  sortBy?: string;
}

export interface IPaginatedMentors {
  data: IMentor[];
  count: number;
  page: number;
  pageSize: number;
}

interface ISupabaseUserResponse {
  data: unknown[] | null;
  error: Error | null;
  count: number | null;
}

interface ISupabaseUser {
  id: string;
  email?: string;
  // Normalized columns from profiles view
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;
  role?: string;
  registration_completed?: boolean;
  location?: string;
  gender?: string;
  price_per_hour?: number;
  time_to_spend?: number;
  number_of_mentees?: number;
  total_years_of_experience?: number;
  current_job_title?: string;
  current_company?: string;
  skills?: string[];
  tools?: string[];
  bio?: string;
  portfolio_url?: string;
  created_at?: string;
  // Note: registration_data and raw_user_meta_data are not in the profiles view
  // to avoid data duplication. Query profiles_table directly if needed.
}

@Injectable({
  providedIn: 'root',
})
export class MentorsService {
  private supabase = inject(SupabaseService);
  private authService = inject(AuthenticationService);
  private readonly pageSize = 12;

  getMentors(
    page = 1,
    filters?: IMentorFilters
  ): Observable<IPaginatedMentors> {
    const currentUser = this.authService.userData.value;
    const currentUserId = currentUser?.id;

    // Query profiles view (now uses normalized profiles_table)
    // Note: registration_data is not in the view to avoid duplication
    // Use profiles_table directly if you need registration_data for complex nested queries
    let query = this.supabase.client
      .from('profiles')
      .select('id, email, full_name, avatar_url, role, registration_completed, location, price_per_hour, current_job_title, current_company, skills, bio, created_at', { count: 'exact' })
      .eq('registration_completed', true)
      .eq('role', RolesEnum.MENTOR);

    // Exclude current user
    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }

    // Text search filter
    if (filters?.text && filters.text.trim()) {
      const searchText = filters.text.trim();
      query = query.ilike('full_name', `%${searchText}%`);
    }

    // Country filter
    if (filters?.country) {
      query = query.eq('location', filters.country);
    }

    // Price filter
    if (filters?.price && Array.isArray(filters.price) && filters.price.length === 2) {
      const [minPrice, maxPrice] = filters.price;
      if (minPrice != null && maxPrice != null) {
        query = query
          .gte('price_per_hour', minPrice)
          .lte('price_per_hour', maxPrice);
      }
    }

    // Sort by
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price_low':
          query = query.order('price_per_hour', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price_per_hour', { ascending: false });
          break;
        case 'rating':
        case 'reviews':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const fromIndex = (page - 1) * this.pageSize;
    const toIndex = fromIndex + this.pageSize - 1;
    query = query.range(fromIndex, toIndex);

    return from(query).pipe(
      map((response: ISupabaseUserResponse) => {
        if (response.error) {
          // Error logged for debugging
          return {
            data: [],
            count: 0,
            page,
            pageSize: this.pageSize,
          };
        }

        let mentors: IMentor[] = (response.data || [])
          .map((item: unknown) => this.mapUserToMentor(item as ISupabaseUser))
          .filter((mentor): mentor is IMentor => mentor !== null);

        if (filters?.experience) {
          const experienceValue = parseInt(filters.experience, 10);
          if (!isNaN(experienceValue)) {
            mentors = mentors.filter(mentor => {
              const user = (response.data || []).find((item: unknown) => {
                const u = item as ISupabaseUser;
                const mapped = this.mapUserToMentor(u);
                return mapped?.name === mentor.name;
              }) as ISupabaseUser | undefined;

              // Use normalized column
              if (user?.total_years_of_experience != null) {
                return user.total_years_of_experience >= experienceValue;
              }
              return false;
            });
          }
        }

        return {
          data: mentors,
          count: response.count || 0,
          page,
          pageSize: this.pageSize,
        };
      }),
      catchError(() => {
        // Error handled silently, return empty result
        return of({
          data: [],
          count: 0,
          page,
          pageSize: this.pageSize,
        });
      })
    );
  }

  private mapUserToMentor(user: ISupabaseUser): IMentor | null {
    // Use normalized columns - no need for registration_data since all fields are normalized
    // Check if user is a mentor using normalized role
    if (user.role !== RolesEnum.MENTOR) {
      return null;
    }

    // All data comes from normalized columns
    const mentor: IMentor = {
      name: user.full_name || user.email?.split('@')[0] || 'Unknown',
      country: (user.location || 'eg') as countryCode,
      profilePicture: user.avatar_url || '',
      jobTitle: user.current_job_title || '',
      company: user.current_company || '',
      rating: 0,
      numberOfReviews: 0,
      price: user.price_per_hour || 0,
      currency: 'EGP',
      description: user.bio || '',
      skills: user.skills || [],
      badges: [],
    };

    return mentor;
  }
}










