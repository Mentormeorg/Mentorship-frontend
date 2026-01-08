import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ReportsService } from '../../services/reports.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss'],
})
export class ReportFormComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private fb = inject(FormBuilder);
  private reportsService = inject(ReportsService);
  private errorHandling = inject(ErrorHandlingService);
  private destroy$ = new Subject<void>();

  reportForm!: FormGroup;
  mentorshipId: string | null = null;
  isSubmitting = false;

  ngOnInit(): void {
    this.mentorshipId = this.route.snapshot.paramMap.get('mentorshipId');
    if (!this.mentorshipId) {
      this.errorHandling.handleError('Invalid mentorship ID');
      this.router.navigate(['/dashboard/mentorships']);
      return;
    }
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.reportForm = this.fb.group({
      period_start_date: ['', Validators.required],
      period_end_date: ['', Validators.required],
      strength_points: this.fb.array([this.fb.control('', Validators.required)]),
      weak_points: this.fb.array([this.fb.control('', Validators.required)]),
      skills_used: this.fb.array([this.fb.control('', Validators.required)]),
      action_items: this.fb.array([
        this.fb.group({
          item: ['', Validators.required],
          priority: ['medium', Validators.required],
        }),
      ]),
      commitment_rate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      consistency_rate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  get strengthPoints(): FormArray {
    return this.reportForm.get('strength_points') as FormArray;
  }

  get weakPoints(): FormArray {
    return this.reportForm.get('weak_points') as FormArray;
  }

  get skillsUsed(): FormArray {
    return this.reportForm.get('skills_used') as FormArray;
  }

  get actionItems(): FormArray {
    return this.reportForm.get('action_items') as FormArray;
  }

  getActionItemGroup(index: number): FormGroup {
    return this.actionItems.at(index) as FormGroup;
  }

  addStrengthPoint(): void {
    this.strengthPoints.push(this.fb.control('', Validators.required));
  }

  removeStrengthPoint(index: number): void {
    if (this.strengthPoints.length > 1) {
      this.strengthPoints.removeAt(index);
    }
  }

  addWeakPoint(): void {
    this.weakPoints.push(this.fb.control('', Validators.required));
  }

  removeWeakPoint(index: number): void {
    if (this.weakPoints.length > 1) {
      this.weakPoints.removeAt(index);
    }
  }

  addSkill(): void {
    this.skillsUsed.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number): void {
    if (this.skillsUsed.length > 1) {
      this.skillsUsed.removeAt(index);
    }
  }

  addActionItem(): void {
    this.actionItems.push(
      this.fb.group({
        item: ['', Validators.required],
        priority: ['medium', Validators.required],
      })
    );
  }

  removeActionItem(index: number): void {
    if (this.actionItems.length > 1) {
      this.actionItems.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.reportForm.invalid || this.isSubmitting || !this.mentorshipId) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.reportForm.value;

    const reportData = {
      mentorship_id: this.mentorshipId,
      period_start_date: formValue.period_start_date,
      period_end_date: formValue.period_end_date,
      strength_points: formValue.strength_points.filter((p: string) => p.trim()),
      weak_points: formValue.weak_points.filter((p: string) => p.trim()),
      skills_used: formValue.skills_used.filter((s: string) => s.trim()),
      action_items: formValue.action_items.filter((a: { item: string; priority: string }) => a.item.trim()),
      commitment_rate: formValue.commitment_rate,
      consistency_rate: formValue.consistency_rate,
    };

    this.reportsService
      .createReport(reportData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (report) => {
          this.errorHandling.showSuccess('Report created successfully', 'Success');
          this.router.navigate(['/dashboard/reports', report.id]);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorHandling.handleError(error);
        },
      });
  }
}

