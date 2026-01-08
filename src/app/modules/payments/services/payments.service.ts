import { inject, Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseService } from '@core/services/supabase.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { AuthenticationService } from '@core/services/authentication.service';
import {
  IPayment,
  IPaymentInitiate,
  IPaymentCallback,
  IRefundRequest,
  IRefundProcess,
} from '@core/interfaces/payment.interface';
import { PaymentTransactionStatusEnum } from '@core/enums/payment-transaction-status.enum';
import { PaymentStatusEnum } from '@core/enums/payment-status.enum';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private supabase = inject(SupabaseService);
  private errorHandling = inject(ErrorHandlingService);
  private authService = inject(AuthenticationService);

  /**
   * Initiate payment for a mentorship
   * This would typically call Paymob API to create a payment order
   */
  initiatePayment(payment: IPaymentInitiate): Observable<{ checkoutUrl: string }> {
    const user = this.authService.userData.value;
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    // In a real implementation, this would call Paymob API
    // For now, we'll create a payment record and return a mock checkout URL
    return from(
      this.supabase.client
        .from('payments')
        .insert({
          mentorship_id: payment.mentorship_id,
          mentee_id: user.id,
          amount: payment.amount,
          currency: payment.currency || 'EGP',
          payment_method: 'paymob',
          transaction_id: `TXN-${Date.now()}`,
          status: PaymentTransactionStatusEnum.PENDING,
        })
        .select()
        .single()
    ).pipe(
      map((response: { data: IPayment | null; error: { message?: string } | null }) => {
        if (response.error) throw response.error;
        if (!response.data) throw new Error('No data returned');
        // In production, this would be the actual Paymob checkout URL
        return {
          checkoutUrl: `https://paymob.com/checkout?order=${response.data.id}`,
        };
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Handle payment callback from Paymob
   */
  handlePaymentCallback(params: IPaymentCallback): Observable<IPayment> {
    // This would typically be handled by a webhook, but for frontend:
    return from(
      this.supabase.client
        .from('payments')
        .update({
          status: params.success
            ? PaymentTransactionStatusEnum.COMPLETED
            : PaymentTransactionStatusEnum.FAILED,
        })
        .eq('transaction_id', params.transaction_id || '')
        .select()
        .single()
    ).pipe(
      map((response: { data: IPayment | null; error: { message?: string } | null }) => {
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
   * Get payment status
   */
  getPaymentStatus(paymentId: string): Observable<IPayment> {
    return from(
      this.supabase.client
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single()
    ).pipe(
      map((response: { data: IPayment | null; error: { message?: string } | null }) => {
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
   * Request a refund
   */
  requestRefund(refund: IRefundRequest): Observable<void> {
    const user = this.authService.userData.value;
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    // Update mentorship with refund request
    return from(
      this.supabase.client
        .from('mentorships')
        .update({
          refund_reason: refund.reason,
        })
        .eq('id', refund.mentorship_id)
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

  /**
   * Release escrow (for mentor after report submission)
   */
  releaseEscrow(mentorshipId: string): Observable<void> {
    // This would typically be called by the system after report submission
    // For now, it's a placeholder
    return from(
      this.supabase.client
        .from('mentorships')
        .update({
          payment_status: PaymentStatusEnum.RELEASED,
          escrow_released_at: new Date().toISOString(),
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

  /**
   * Process refund (admin only)
   */
  processRefund(refund: IRefundProcess): Observable<void> {
    return from(
      this.supabase.client
        .from('mentorships')
        .update({
          payment_status: PaymentStatusEnum.REFUNDED,
          refund_amount: refund.amount,
          refund_reason: refund.reason,
        })
        .eq('id', refund.mentorship_id)
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

