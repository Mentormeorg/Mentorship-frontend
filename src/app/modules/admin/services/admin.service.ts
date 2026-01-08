import { inject, Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseService } from '@core/services/supabase.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import {
  IMentorApplication,
  IMentorApplicationReview,
} from '@core/interfaces/mentor-application.interface';
import { IMentorship } from '@core/interfaces/mentorship.interface';
import { IReport } from '@core/interfaces/report.interface';
import { MentorApplicationStatusEnum } from '@core/enums/mentor-application-status.enum';
import { ReportReviewStatusEnum } from '@core/enums/report-review-status.enum';
import { MentorshipStatusEnum } from '@core/enums/mentorship-status.enum';
import { PaymentStatusEnum } from '@core/enums/payment-status.enum';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private supabase = inject(SupabaseService);
  private errorHandling = inject(ErrorHandlingService);

  /**
   * Get pending mentor applications
   */
  getPendingMentorApplications(): Observable<IMentorApplication[]> {
    return from(
      this.supabase.client
        .from('mentor_applications')
        .select('*')
        .eq('status', MentorApplicationStatusEnum.PENDING)
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

  /**
   * Approve mentor application
   */
  approveMentorApplication(id: string): Observable<IMentorApplication> {
    return from(
      this.supabase.client
        .from('mentor_applications')
        .update({
          status: MentorApplicationStatusEnum.APPROVED,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)
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
   * Reject mentor application
   */
  rejectMentorApplication(
    id: string,
    reason: string
  ): Observable<IMentorApplication> {
    return from(
      this.supabase.client
        .from('mentor_applications')
        .update({
          status: MentorApplicationStatusEnum.REJECTED,
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)
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
   * Get active mentorships
   */
  getActiveMentorships(): Observable<IMentorship[]> {
    return from(
      this.supabase.client
        .from('mentorships')
        .select('*')
        .in('status', [MentorshipStatusEnum.ACTIVE, MentorshipStatusEnum.COMPLETED_WAITING_REPORT])
        .order('created_at', { ascending: false })
    ).pipe(
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
   * Get flagged reports
   */
  getFlaggedReports(): Observable<IReport[]> {
    return from(
      this.supabase.client
        .from('reports')
        .select('*')
        .eq('admin_review_status', ReportReviewStatusEnum.FLAGGED)
        .order('created_at', { ascending: false })
    ).pipe(
      map((response: { data: IReport[] | null; error: { message?: string } | null }) => {
        if (response.error) throw response.error;
        return (response.data || []) as IReport[];
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Approve report
   */
  approveReport(id: string): Observable<IReport> {
    return from(
      this.supabase.client
        .from('reports')
        .update({
          admin_review_status: ReportReviewStatusEnum.APPROVED,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map((response: { data: IReport | null; error: { message?: string } | null }) => {
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
   * Flag report
   */
  flagReport(id: string, notes: string): Observable<IReport> {
    return from(
      this.supabase.client
        .from('reports')
        .update({
          admin_review_status: ReportReviewStatusEnum.FLAGGED,
          admin_review_notes: notes,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map((response: { data: IReport | null; error: { message?: string } | null }) => {
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
   * Get pending refunds
   */
  getPendingRefunds(): Observable<IMentorship[]> {
    return from(
      this.supabase.client
        .from('mentorships')
        .select('*')
        .not('refund_reason', 'is', null)
        .eq('payment_status', PaymentStatusEnum.ESCROWED)
        .order('created_at', { ascending: false })
    ).pipe(
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
   * Process refund
   */
  processRefund(
    mentorshipId: string,
    amount: number,
    reason: string
  ): Observable<void> {
    return from(
      this.supabase.client
        .from('mentorships')
        .update({
          payment_status: PaymentStatusEnum.REFUNDED,
          refund_amount: amount,
          refund_reason: reason,
        })
        .eq('id', mentorshipId)
    ).pipe(
      map((response: { error: { message?: string } | null }) => {
        if (response.error) throw response.error;
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }
}

