import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PaymentsService } from '../../services/payments.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-checkout.component.html',
  styleUrls: ['./payment-checkout.component.scss'],
})
export class PaymentCheckoutComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentsService = inject(PaymentsService);
  private errorHandling = inject(ErrorHandlingService);
  private destroy$ = new Subject<void>();

  mentorshipId: string | null = null;
  amount: number = 0;
  isLoading = true;
  isProcessing = false;

  ngOnInit(): void {
    this.mentorshipId = this.route.snapshot.paramMap.get('mentorshipId');
    const amountParam = this.route.snapshot.queryParamMap.get('amount');
    this.amount = amountParam ? parseFloat(amountParam) : 0;

    if (!this.mentorshipId || this.amount <= 0) {
      this.errorHandling.handleError('Invalid payment parameters');
      this.router.navigate(['/dashboard/mentorships']);
      return;
    }

    this.initiatePayment();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initiatePayment(): void {
    if (!this.mentorshipId) return;

    this.isProcessing = true;
    this.paymentsService
      .initiatePayment({
        mentorship_id: this.mentorshipId,
        amount: this.amount,
        currency: 'EGP',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Redirect to Paymob checkout
          window.location.href = response.checkoutUrl;
        },
        error: (error) => {
          this.isProcessing = false;
          this.isLoading = false;
          this.errorHandling.handleError(error);
        },
      });
  }
}

