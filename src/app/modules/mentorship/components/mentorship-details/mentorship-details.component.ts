import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MentorshipService } from '../../services/mentorship.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { IMentorship } from '@core/interfaces/mentorship.interface';
import { MentorshipStatusEnum } from '@core/enums/mentorship-status.enum';
import { RolesEnum } from '@core/enums/roles.enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mentorship-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mentorship-details.component.html',
  styleUrls: ['./mentorship-details.component.scss'],
})
export class MentorshipDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private mentorshipService = inject(MentorshipService);
  private errorHandling = inject(ErrorHandlingService);
  private authService = inject(AuthenticationService);
  private destroy$ = new Subject<void>();

  mentorship: IMentorship | null = null;
  mentorshipId: string | null = null;
  isLoading = true;
  isProcessing = false;
  rejectionReason = '';
  showRejectionForm = false;
  currentUserRole: RolesEnum | null = null;

  readonly MentorshipStatusEnum = MentorshipStatusEnum;

  ngOnInit(): void {
    this.mentorshipId = this.route.snapshot.paramMap.get('id');
    this.currentUserRole = this.authService.userData.value?.role || null;

    if (this.mentorshipId) {
      this.loadMentorship();
    } else {
      this.errorHandling.handleError('Invalid mentorship ID');
      this.router.navigate(['/dashboard/mentorships']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMentorship(): void {
    if (!this.mentorshipId) return;

    this.isLoading = true;
    this.mentorshipService
      .getMentorshipById(this.mentorshipId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.mentorship = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorHandling.handleError(error);
        },
      });
  }

  acceptRequest(): void {
    if (!this.mentorshipId || this.isProcessing) return;

    this.isProcessing = true;
    this.mentorshipService
      .acceptMentorshipRequest(this.mentorshipId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.errorHandling.showSuccess(
            'Mentorship request accepted',
            'Success'
          );
          this.loadMentorship();
          this.isProcessing = false;
        },
        error: (error) => {
          this.isProcessing = false;
          this.errorHandling.handleError(error);
        },
      });
  }

  rejectRequest(): void {
    if (!this.mentorshipId || this.isProcessing || !this.rejectionReason.trim()) {
      return;
    }

    this.isProcessing = true;
    this.mentorshipService
      .rejectMentorshipRequest(this.mentorshipId, this.rejectionReason)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.errorHandling.showSuccess(
            'Mentorship request rejected',
            'Success'
          );
          this.loadMentorship();
          this.isProcessing = false;
          this.showRejectionForm = false;
        },
        error: (error) => {
          this.isProcessing = false;
          this.errorHandling.handleError(error);
        },
      });
  }

  canAccept(): boolean {
    return (
      this.mentorship?.status === MentorshipStatusEnum.PENDING_MENTOR_APPROVAL &&
      this.currentUserRole === RolesEnum.MENTOR
    );
  }

  canReject(): boolean {
    return (
      this.mentorship?.status === MentorshipStatusEnum.PENDING_MENTOR_APPROVAL &&
      this.currentUserRole === RolesEnum.MENTOR
    );
  }

  goToChat(): void {
    if (this.mentorship) {
      this.router.navigate(['/dashboard/chat', this.mentorship.id]);
    }
  }
}

