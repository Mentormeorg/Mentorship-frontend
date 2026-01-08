import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { IMentor } from '@shared/interfaces/mentor.interface';
import { MentorsService, IMentorFilters } from '@modules/dashboard/services/mentors.service';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-smart-mentor-cards',
  templateUrl: './smart-mentor-cards.component.html',
  styleUrls: ['./smart-mentor-cards.component.scss'],
})
export class SmartMentorCardsComponent implements OnInit, OnDestroy {
  private mentorsService = inject(MentorsService);
  private destroy$ = new Subject<void>();
  private filterSubject = new Subject<IMentorFilters>();

  public mentorData: IMentor[] = [];
  public loading = false;
  public currentPage = 1;
  public totalPages = 1;
  public totalCount = 0;
  public pageSize = 12;
  public currentFilters: IMentorFilters = {};

  ngOnInit(): void {
    // Debounce filter changes
    this.filterSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => {
          return JSON.stringify(prev) === JSON.stringify(curr);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(filters => {
        this.currentFilters = filters;
        this.currentPage = 1;
        this.loadMentors();
      });

    this.loadMentors();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMentors(): void {
    this.loading = true;
    this.mentorsService
      .getMentors(this.currentPage, this.currentFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.mentorData = response.data;
          this.totalCount = response.count;
          this.totalPages = Math.ceil(response.count / this.pageSize);
          this.loading = false;
        },
        error: error => {
          console.error('Error loading mentors:', error);
          this.mentorData = [];
          this.totalCount = 0;
          this.totalPages = 1;
          this.loading = false;
        },
      });
  }

  onFiltersChange(filters: IMentorFilters): void {
    this.filterSubject.next(filters);
  }

  onPageChange(event: { page?: number; first?: number; rows?: number; pageCount?: number } | number): void {
    // PrimeNG paginator emits {first, rows, page, pageCount}
    const page = typeof event === 'object' && event.page !== undefined ? event.page + 1 : typeof event === 'number' ? event : 1;
    this.currentPage = typeof page === 'number' ? page : 1;
    this.loadMentors();
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
