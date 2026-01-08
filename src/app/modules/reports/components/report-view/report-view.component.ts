import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ReportsService } from '../../services/reports.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { IReport } from '@core/interfaces/report.interface';
import { RolesEnum } from '@core/enums/roles.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss'],
})
export class ReportViewComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private fb = inject(FormBuilder);
  private reportsService = inject(ReportsService);
  private errorHandling = inject(ErrorHandlingService);
  private authService = inject(AuthenticationService);
  private destroy$ = new Subject<void>();

  report: IReport | null = null;
  reportId: string | null = null;
  isLoading = true;
  isSubmittingComment = false;
  commentForm!: FormGroup;
  currentUserRole: RolesEnum | null = null;

  ngOnInit(): void {
    this.reportId = this.route.snapshot.paramMap.get('id');
    this.currentUserRole = this.authService.userData.value?.role || null;

    if (this.reportId) {
      this.loadReport();
      this.initCommentForm();
    } else {
      this.errorHandling.handleError('Invalid report ID');
      this.router.navigate(['/dashboard/reports']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initCommentForm(): void {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }

  loadReport(): void {
    if (!this.reportId) return;

    this.isLoading = true;
    this.reportsService
      .getReportById(this.reportId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.report = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorHandling.handleError(error);
        },
      });
  }

  onSubmitComment(): void {
    if (this.commentForm.invalid || this.isSubmittingComment || !this.reportId) {
      return;
    }

    this.isSubmittingComment = true;
    this.reportsService
      .addMenteeComment({
        report_id: this.reportId,
        comment: this.commentForm.get('comment')?.value,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.errorHandling.showSuccess('Comment added successfully', 'Success');
          this.commentForm.reset();
          this.loadReport();
          this.isSubmittingComment = false;
        },
        error: (error) => {
          this.isSubmittingComment = false;
          this.errorHandling.handleError(error);
        },
      });
  }

  canAddComment(): boolean {
    return (
      this.currentUserRole === RolesEnum.MENTEE &&
      this.report !== null &&
      !this.report.mentee_comments
    );
  }
}

