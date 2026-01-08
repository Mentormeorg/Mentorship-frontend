import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MentorshipService } from '../../services/mentorship.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { IMentorship } from '@core/interfaces/mentorship.interface';
import { MentorshipStatusEnum } from '@core/enums/mentorship-status.enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mentorship-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mentorship-list.component.html',
  styleUrls: ['./mentorship-list.component.scss'],
})
export class MentorshipListComponent implements OnInit, OnDestroy {
  public router = inject(Router);
  private mentorshipService = inject(MentorshipService);
  private errorHandling = inject(ErrorHandlingService);
  private destroy$ = new Subject<void>();

  mentorships: IMentorship[] = [];
  filteredMentorships: IMentorship[] = [];
  selectedStatus: MentorshipStatusEnum | 'all' = 'all';
  isLoading = true;

  readonly statusOptions = [
    { value: 'all', label: 'All' },
    { value: MentorshipStatusEnum.ACTIVE, label: 'Active' },
    { value: MentorshipStatusEnum.COMPLETED_WITH_REPORT, label: 'Completed' },
    { value: MentorshipStatusEnum.COMPLETED_WAITING_REPORT, label: 'Waiting for Report' },
    { value: MentorshipStatusEnum.REQUEST_SENT, label: 'Pending Approval' },
  ];

  ngOnInit(): void {
    this.loadMentorships();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMentorships(): void {
    this.isLoading = true;
    this.mentorshipService
      .getMentorships()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.mentorships = data;
          this.filterMentorships();
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorHandling.handleError(error);
        },
      });
  }

  filterMentorships(): void {
    if (this.selectedStatus === 'all') {
      this.filteredMentorships = this.mentorships;
    } else {
      this.filteredMentorships = this.mentorships.filter(
        (m) => m.status === this.selectedStatus
      );
    }
  }

  onStatusChange(): void {
    this.filterMentorships();
  }

  getStatusLabel(status: MentorshipStatusEnum): string {
    const statusMap: Record<MentorshipStatusEnum, string> = {
      [MentorshipStatusEnum.REQUEST_SENT]: 'Request Sent',
      [MentorshipStatusEnum.PENDING_MENTOR_APPROVAL]: 'Pending Approval',
      [MentorshipStatusEnum.ACTIVE]: 'Active',
      [MentorshipStatusEnum.COMPLETED_WAITING_REPORT]: 'Waiting for Report',
      [MentorshipStatusEnum.COMPLETED_WITH_REPORT]: 'Completed',
      [MentorshipStatusEnum.TERMINATED_BY_MENTOR]: 'Terminated',
      [MentorshipStatusEnum.TERMINATED_BY_ADMIN]: 'Terminated',
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: MentorshipStatusEnum): string {
    const classMap: Record<MentorshipStatusEnum, string> = {
      [MentorshipStatusEnum.REQUEST_SENT]: 'status-pending',
      [MentorshipStatusEnum.PENDING_MENTOR_APPROVAL]: 'status-pending',
      [MentorshipStatusEnum.ACTIVE]: 'status-active',
      [MentorshipStatusEnum.COMPLETED_WAITING_REPORT]: 'status-warning',
      [MentorshipStatusEnum.COMPLETED_WITH_REPORT]: 'status-completed',
      [MentorshipStatusEnum.TERMINATED_BY_MENTOR]: 'status-terminated',
      [MentorshipStatusEnum.TERMINATED_BY_ADMIN]: 'status-terminated',
    };
    return classMap[status] || '';
  }

  viewDetails(id: string): void {
    this.router.navigate(['/dashboard/mentorships', id]);
  }
}

