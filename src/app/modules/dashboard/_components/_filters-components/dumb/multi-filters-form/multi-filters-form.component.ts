import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IFilter } from '@modules/dashboard/interfaces/filter.interface';
import { FormGroup } from '@angular/forms';
import { IMentorFilters } from '@modules/dashboard/services/mentors.service';

interface IFormValue {
  text?: string;
  country?: string;
  rate?: string;
  experience?: string;
  price?: [number, number];
  [key: string]: unknown;
}

interface ISelectButtonEvent {
  value?: string;
}

@Component({
  selector: 'app-multi-filters-form',
  templateUrl: './multi-filters-form.component.html',
  styleUrls: ['./multi-filters-form.component.scss'],
})
export class MultiFiltersFormComponent {
  @Input() filterConfig?: IFilter;
  @Input() filterObj?: FormGroup;
  @Input() sortBy?: string;

  @Output() filterChange: EventEmitter<IFormValue> = new EventEmitter();
  @Output() sortChange: EventEmitter<string> = new EventEmitter();
  @Output() filtersChange = new EventEmitter<IMentorFilters>();

  submitFilters(): void {
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
    this.filterChange.emit(formValue);
    this.filtersChange.emit(filters);
  }

  changeSortBy(event: ISelectButtonEvent | string): void {
    const sortValue = typeof event === 'object' && event?.value
      ? event.value
      : typeof event === 'string'
        ? event
        : '';
    this.sortChange.emit(sortValue);
    const formValue = this.filterObj?.value || {};
    const filters: IMentorFilters = {
      text: formValue.text?.trim() || undefined,
      country: formValue.country || undefined,
      rate: formValue.rate || undefined,
      experience: formValue.experience || undefined,
      price: Array.isArray(formValue.price) && formValue.price.length === 2
        ? formValue.price
        : undefined,
      sortBy: sortValue || undefined,
    };
    this.filtersChange.emit(filters);
  }
}
