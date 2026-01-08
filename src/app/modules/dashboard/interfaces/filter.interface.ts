import { LocationEnum } from '@core/enums/location.enum';
import {
  EXPERIENCE_OPTIONS,
  Rate_OPTIONS,
  SORT_TYPE,
} from '../enums';

export interface IFilter {
  rate: IDropDownFilter<Rate_OPTIONS>;
  experience: IDropDownFilter<EXPERIENCE_OPTIONS>;
  price: IRangeFilter;
  country: IDropDownFilter<LocationEnum>;
  sortBy: IDropDownFilter<SORT_TYPE>;
}

interface IDropDownFilter<T> {
  options: T[];
}

interface IRangeFilter {
  min: number;
  max: number;
}
