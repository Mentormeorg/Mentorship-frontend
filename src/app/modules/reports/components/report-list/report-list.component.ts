import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ReportsService } from '../../services/reports.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { IReport } from '@core/interfaces/report.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
})
export class ReportListComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private reportsService = inject(ReportsService);
  private errorHandling = inject(ErrorHandlingService);
  private destroy$ = new Subject<void>();

  reports: IReport[] = [];
  isLoading = true;

  ngOnInit(): void {
    // This would load reports based on user role
    // For now, placeholder
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  viewReport(id: string): void {
    this.router.navigate(['/dashboard/reports', id]);
  }
}

