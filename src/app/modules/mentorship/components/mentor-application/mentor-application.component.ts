import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MentorshipService } from '../../services/mentorship.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mentor-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mentor-application.component.html',
  styleUrls: ['./mentor-application.component.scss'],
})
export class MentorApplicationComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  public router = inject(Router);
  private mentorshipService = inject(MentorshipService);
  private errorHandling = inject(ErrorHandlingService);
  private destroy$ = new Subject<void>();

  applicationForm!: FormGroup;
  isSubmitting = false;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.applicationForm = this.fb.group({
      motivation: ['', [Validators.required, Validators.minLength(100)]],
      experience: ['', [Validators.required, Validators.minLength(100)]],
      expertise: ['', [Validators.required]],
      availability: ['', [Validators.required]],
      additionalInfo: [''],
    });
  }

  onSubmit(): void {
    if (this.applicationForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.applicationForm.value;

    const applicationData = {
      application_data: {
        motivation: formValue.motivation,
        experience: formValue.experience,
        expertise: formValue.expertise,
        availability: formValue.availability,
        additionalInfo: formValue.additionalInfo,
        submittedAt: new Date().toISOString(),
      },
    };

    this.mentorshipService
      .submitMentorApplication(applicationData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.errorHandling.showSuccess(
            'Application submitted successfully',
            'Success'
          );
          this.router.navigate(['/dashboard/mentorships']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorHandling.handleError(error);
        },
      });
  }
}

