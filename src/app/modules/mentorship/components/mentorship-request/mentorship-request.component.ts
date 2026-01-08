import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MentorshipService } from '../../services/mentorship.service';
import { MentorsService } from '@modules/dashboard/services/mentors.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { IMentor } from '@shared/interfaces/mentor.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mentorship-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mentorship-request.component.html',
  styleUrls: ['./mentorship-request.component.scss'],
})
export class MentorshipRequestComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mentorshipService = inject(MentorshipService);
  private mentorsService = inject(MentorsService);
  private errorHandling = inject(ErrorHandlingService);
  private destroy$ = new Subject<void>();

  mentorId: string | null = null;
  mentor: IMentor | null = null;
  paymentAmount: number = 0;
  isLoading = true;
  isSubmitting = false;

  ngOnInit(): void {
    this.mentorId = this.route.snapshot.paramMap.get('mentorId');
    if (this.mentorId) {
      this.loadMentorInfo();
    } else {
      this.errorHandling.handleError('Invalid mentor ID');
      this.router.navigate(['/dashboard/discover']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMentorInfo(): void {
    // In a real scenario, you'd fetch mentor details by ID
    // For now, we'll use the price from the mentor card
    // This would need to be implemented in MentorsService
    this.isLoading = false;
    // Set default payment amount (this should come from mentor's pricing)
    this.paymentAmount = 500; // Default EGP amount
  }

  onSubmit(): void {
    if (!this.mentorId || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.mentorshipService
      .sendMentorshipRequest({
        mentor_id: this.mentorId,
        payment_amount: this.paymentAmount,
        payment_currency: 'EGP',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (mentorship) => {
          this.errorHandling.showSuccess(
            'Mentorship request sent successfully',
            'Success'
          );
          this.router.navigate(['/dashboard/mentorships', mentorship.id]);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorHandling.handleError(error);
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/discover']);
  }
}

