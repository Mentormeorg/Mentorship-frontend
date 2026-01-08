import { inject, Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SupabaseService } from '@core/services/supabase.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { AuthenticationService } from '@core/services/authentication.service';
import {
  IReport,
  IReportCreate,
  IReportComment,
} from '@core/interfaces/report.interface';
import { MentorshipStatusEnum } from '@core/enums/mentorship-status.enum';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private supabase = inject(SupabaseService);
  private errorHandling = inject(ErrorHandlingService);
  private authService = inject(AuthenticationService);

  /**
   * Create a report
   */
  createReport(report: IReportCreate): Observable<IReport> {
    const user = this.authService.userData.value;
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    // Get mentorship to get mentee_id
    return from(
      this.supabase.client
        .from('mentorships')
        .select('mentee_id')
        .eq('id', report.mentorship_id)
        .single()
    ).pipe(
      switchMap((mentorshipResponse: { data: { mentee_id: string } | null; error: { message?: string } | null }) => {
        if (mentorshipResponse.error) throw mentorshipResponse.error;
        if (!mentorshipResponse.data) throw new Error('Mentorship not found');

        return from(
          this.supabase.client
            .from('reports')
            .insert({
              ...report,
              mentor_id: user.id,
              mentee_id: mentorshipResponse.data.mentee_id,
            })
            .select()
            .single()
        ).pipe(
          switchMap((reportResponse: { data: IReport | null; error: { message?: string } | null }) => {
            if (reportResponse.error) throw reportResponse.error;
            if (!reportResponse.data) throw new Error('Report creation failed');

            // Update mentorship status
            return from(
              this.supabase.client
                .from('mentorships')
                .update({
                  status: MentorshipStatusEnum.COMPLETED_WITH_REPORT,
                  ended_at: new Date().toISOString(),
                })
                .eq('id', report.mentorship_id)
            ).pipe(
              map(() => reportResponse.data as IReport)
            );
          })
        );
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Get reports by mentorship ID
   */
  getReportsByMentorship(mentorshipId: string): Observable<IReport[]> {
    return from(
      this.supabase.client
        .from('reports')
        .select('*')
        .eq('mentorship_id', mentorshipId)
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
   * Get report by ID
   */
  getReportById(id: string): Observable<IReport> {
    return from(
      this.supabase.client
        .from('reports')
        .select('*')
        .eq('id', id)
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
   * Add mentee comment to report
   */
  addMenteeComment(comment: IReportComment): Observable<IReport> {
    return from(
      this.supabase.client
        .from('reports')
        .update({
          mentee_comments: comment.comment,
        })
        .eq('id', comment.report_id)
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
   * Get reports for a mentee (for new mentors to view)
   */
  getReportsForNewMentor(menteeId: string): Observable<IReport[]> {
    return from(
      this.supabase.client
        .from('reports')
        .select('*')
        .eq('mentee_id', menteeId)
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
   * Download report as PDF (placeholder - would need PDF generation service)
   */
  downloadReportPDF(reportId: string): Observable<Blob> {
    // This would typically call a backend endpoint that generates PDF
    // For now, return an error
    throw new Error('PDF download not implemented');
  }
}

