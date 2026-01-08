import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { IMentorApplication } from '@core/interfaces/mentor-application.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mentor-applications-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mentor-applications-review.component.html',
  styleUrls: ['./mentor-applications-review.component.scss'],
})
export class MentorApplicationsReviewComponent implements OnInit, OnDestroy {
  private adminService = inject(AdminService);
  private errorHandling = inject(ErrorHandlingService);
  private destroy$ = new Subject<void>();

  applications: IMentorApplication[] = [];
  isLoading = true;
  selectedApplication: IMentorApplication | null = null;
  rejectionReason = '';
  showRejectionForm = false;

  ngOnInit(): void {
    this.loadApplications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.adminService
      .getPendingMentorApplications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.applications = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorHandling.handleError(error);
        },
      });
  }

  approveApplication(id: string): void {
    this.adminService
      .approveMentorApplication(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.errorHandling.showSuccess('Application approved', 'Success');
          this.loadApplications();
        },
        error: (error) => {
          this.errorHandling.handleError(error);
        },
      });
  }

  rejectApplication(id: string): void {
    if (!this.rejectionReason.trim()) {
      this.errorHandling.handleError('Rejection reason is required');
      return;
    }

    this.adminService
      .rejectMentorApplication(id, this.rejectionReason)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.errorHandling.showSuccess('Application rejected', 'Success');
          this.rejectionReason = '';
          this.showRejectionForm = false;
          this.selectedApplication = null;
          this.loadApplications();
        },
        error: (error) => {
          this.errorHandling.handleError(error);
        },
      });
  }

  openRejectionForm(application: IMentorApplication): void {
    this.selectedApplication = application;
    this.showRejectionForm = true;
  }
}

