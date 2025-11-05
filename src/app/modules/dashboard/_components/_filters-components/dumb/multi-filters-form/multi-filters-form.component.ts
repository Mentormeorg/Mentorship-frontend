import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IFilter } from '@modules/dashboard/interfaces/filter.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-multi-filters-form',
  templateUrl: './multi-filters-form.component.html',
  styleUrls: ['./multi-filters-form.component.scss'],
})
export class MultiFiltersFormComponent {
  @Input() filterConfig?: IFilter;
  @Input() filterObj?: FormGroup;
  @Input() sortBy?: string;

  @Output() filterChange: EventEmitter<IFilter> = new EventEmitter();
  @Output() sortChange: EventEmitter<IFilter> = new EventEmitter();

  submitFilters() {
    this.filterChange.emit(this.filterObj?.value);
  }

  changeSortBy($event: any) {
    this.sortChange.emit($event.value);
  }
}
