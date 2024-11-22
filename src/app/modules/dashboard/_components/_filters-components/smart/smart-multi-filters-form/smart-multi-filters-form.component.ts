import {Component, inject} from '@angular/core';
import {EXPERIENCE_OPTIONS, Rate_OPTIONS, SORT_TYPE} from "@modules/dashboard/enums";
import {LocationList} from "@core/enums/location.enum";
import {FormBuilder, FormGroup} from "@angular/forms";
import {IFilter} from "@modules/dashboard/interfaces";
import skillsAndSpecialties from "@assets/constants/skills";

@Component({
	selector: 'app-smart-multi-filters-form',
	templateUrl: './smart-multi-filters-form.component.html',
	styleUrls: ['./smart-multi-filters-form.component.scss']
})
export class SmartMultiFiltersFormComponent {
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
			speciality: {
				options: skillsAndSpecialties,
			},
			price: {
				min: 100,
				max: 10000,
			},
			country: {
				options: new LocationList().COUNTRIES_OBJ,
			},
		}

		this.filterObj = this.fb.group({
			rate: [null],
			experience: [null],
			price: [[this.filterConfig.price.min, this.filterConfig.price.max],],
			country: [null],
			speciality: [null],
			text: [null],
		})
	}

	onFilterChange(event: any) {
		console.log(event);
	}

	onSortChange(event: any) {
		console.log(event);
	}
}
