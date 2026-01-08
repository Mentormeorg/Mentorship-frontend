import { inject, Injectable } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseService } from '@core/services/supabase.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { AuthenticationService } from '@core/services/authentication.service';
import {
  IMentorship,
  IMentorshipRequest,
  IMentorshipTermination,
} from '@core/interfaces/mentorship.interface';
import {
  IMentorApplication,
  IMentorApplicationSubmit,
} from '@core/interfaces/mentor-application.interface';
import { MentorshipStatusEnum } from '@core/enums/mentorship-status.enum';
import { MentorApplicationStatusEnum } from '@core/enums/mentor-application-status.enum';
import { PaymentStatusEnum } from '@core/enums/payment-status.enum';

@Injectable({
  providedIn: 'root',
})
export class MentorshipService {
  private supabase = inject(SupabaseService);
  private errorHandling = inject(ErrorHandlingService);
  private authService = inject(AuthenticationService);

  /**
   * Send a mentorship request
   */
  sendMentorshipRequest(request: IMentorshipRequest): Observable<IMentorship> {
    const user = this.authService.userData.value;
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    return from(
      this.supabase.client
        .from('mentorships')
        .insert({
          mentee_id: user.id,
          mentor_id: request.mentor_id,
          status: MentorshipStatusEnum.REQUEST_SENT,
          payment_amount: request.payment_amount,
          payment_currency: request.payment_currency || 'EGP',
          payment_status: PaymentStatusEnum.PENDING,
        })
        .select()
        .single()
    ).pipe(
      map((response: { data: IMentorship | null; error: { message?: string } | null }) => {
        if (response.error) throw response.error;
        if (!response.data) throw new Error('No data returned');
        return response.data;
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Get mentorships for current user (filtered by status if provided)
   */
  getMentorships(status?: MentorshipStatusEnum): Observable<IMentorship[]> {
    const user = this.authService.userData.value;
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    let query = this.supabase.client
      .from('mentorships')
      .select('*')
      .or(`mentee_id.eq.${user.id},mentor_id.eq.${user.id}`);

    if (status) {
      query = query.eq('status', status);
    }

    return from(query.order('created_at', { ascending: false })).pipe(
      map((response: { data: IMentorship[] | null; error: { message?: string } | null }) => {
        if (response.error) throw response.error;
        return (response.data || []) as IMentorship[];
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Get mentorship by ID
   */
  getMentorshipById(id: string): Observable<IMentorship> {
    return from(
      this.supabase.client
        .from('mentorships')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map((response: { data: IMentorship | null; error: { message?: string } | null }) => {
        if (response.error) throw response.error;
        if (!response.data) throw new Error('No data returned');
        return response.data;
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Accept a mentorship request (mentor only)
   */
  acceptMentorshipRequest(id: string): Observable<IMentorship> {
    return from(
      this.supabase.client
        .from('mentorships')
        .update({
          status: MentorshipStatusEnum.ACTIVE,
          started_at: new Date().toISOString(),
          payment_status: PaymentStatusEnum.ESCROWED,
        })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map((response: { data: IMentorship | null; error: { message?: string } | null }) => {
        if (response.error) throw response.error;
        if (!response.data) throw new Error('No data returned');
        return response.data;
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Reject a mentorship request (mentor only)
   */
  rejectMentorshipRequest(
    id: string,
    reason?: string
  ): Observable<IMentorship> {
    return from(
      this.supabase.client
        .from('mentorships')
        .update({
          status: MentorshipStatusEnum.TERMINATED_BY_MENTOR,
          terminated_at: new Date().toISOString(),
          termination_reason: reason || 'Rejected by mentor',
          payment_status: PaymentStatusEnum.REFUNDED,
        })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map((response: { data: IMentorship | null; error: { message?: string } | null }) => {
        if (response.error) throw response.error;
        if (!response.data) throw new Error('No data returned');
        return response.data;
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Terminate a mentorship
   */
  terminateMentorship(
    termination: IMentorshipTermination
  ): Observable<IMentorship> {
    return from(
      this.supabase.client
        .from('mentorships')
        .update({
          status: MentorshipStatusEnum.TERMINATED_BY_MENTOR,
          terminated_at: new Date().toISOString(),
          termination_reason: termination.reason,
        })
        .eq('id', termination.mentorship_id)
        .select()
        .single()
    ).pipe(
      map((response: { data: IMentorship | null; error: { message?: string } | null }) => {
        if (response.error) throw response.error;
        if (!response.data) throw new Error('No data returned');
        return response.data;
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Submit a mentor application
   */
  submitMentorApplication(
    application: IMentorApplicationSubmit
  ): Observable<IMentorApplication> {
    const user = this.authService.userData.value;
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    return from(
      this.supabase.client
        .from('mentor_applications')
        .insert({
          user_id: user.id,
          status: MentorApplicationStatusEnum.PENDING,
          application_data: application.application_data,
        })
        .select()
        .single()
    ).pipe(
      map((response: { data: IMentorApplication | null; error: { message?: string } | null }) => {
        if (response.error) throw response.error;
        if (!response.data) throw new Error('No data returned');
        return response.data;
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Get mentor applications for current user
   */
  getMentorApplications(): Observable<IMentorApplication[]> {
    const user = this.authService.userData.value;
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    return from(
      this.supabase.client
        .from('mentor_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    ).pipe(
      map((response: { data: IMentorApplication[] | null; error: { message?: string } | null }) => {
        if (response.error) throw response.error;
        return (response.data || []) as IMentorApplication[];
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }
}

