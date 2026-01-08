import { Component, inject, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import {
  EXPERIENCE_OPTIONS,
  Rate_OPTIONS,
  SORT_TYPE,
} from '@modules/dashboard/enums';
import { LocationEnum } from '@core/enums/location.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IFilter } from '@modules/dashboard/interfaces';
import { IMentorFilters } from '@modules/dashboard/services/mentors.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-smart-multi-filters-form',
  templateUrl: './smart-multi-filters-form.component.html',
  styleUrls: ['./smart-multi-filters-form.component.scss'],
})
export class SmartMultiFiltersFormComponent implements OnInit, OnDestroy {
  @Output() filtersChange = new EventEmitter<IMentorFilters>();

  private destroy$ = new Subject<void>();

  sortBy: SORT_TYPE | string;
  filterObj: FormGroup;
  filterConfig: IFilter;
  fb: FormBuilder = inject(FormBuilder);

  constructor() {
    this.sortBy = '';

    this.filterConfig = {
      rate: {
        options: Object.values(Rate_OPTIONS),
      },
      experience: {
        options: Object.values(EXPERIENCE_OPTIONS),
      },
      sortBy: {
        options: Object.values(SORT_TYPE),
      },
      price: {
        min: 100,
        max: 10000,
      },
      country: {
        options: Object.values(LocationEnum),
      },
    };

    this.filterObj = this.fb.group({
      rate: [null],
      experience: [null],
      price: [
        [this.filterConfig.price.min, this.filterConfig.price.max],
      ],
      country: [null],
      text: [null],
    });
  }

  ngOnInit(): void {
    // Emit initial filters
    this.emitFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private emitFilters(): void {
    const formValue = this.filterObj?.value || {};
    const filters: IMentorFilters = {
      text: formValue.text?.trim() || undefined,
      country: formValue.country || undefined,
      rate: formValue.rate || undefined,
      experience: formValue.experience || undefined,
      price: Array.isArray(formValue.price) && formValue.price.length === 2
        ? formValue.price
        : undefined,
      sortBy: this.sortBy || undefined,
    };
    this.filtersChange.emit(filters);
  }

  onFilterChange(event: Record<string, unknown> | null | { [key: string]: unknown }): void {
    // Update form values from event if needed
    if (event && typeof event === 'object') {
      Object.keys(event).forEach(key => {
        if (this.filterObj.get(key)) {
          this.filterObj.patchValue({ [key]: event[key] }, { emitEvent: false });
        }
      });
    }
    this.emitFilters();
  }

  onSortChange(event: { value?: string } | string | null): void {
    this.sortBy = (typeof event === 'object' && event?.value) || (typeof event === 'string' ? event : '') || '';
    this.emitFilters();
  }
}
