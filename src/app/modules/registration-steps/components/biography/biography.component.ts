import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RolesEnum } from '@core/enums';
import { IStep4 } from '@modules/registration-steps/models/interfaces/steps.interface';
import { SteperService } from '@modules/registration-steps/services/steper.service';
import { IStep1 } from '../../models/interfaces/steps.interface';
import { getValidationErrorMessage } from '@shared/utils/validation.utils';
import tools from '@assets/constants/tools';
import skillsAndSpecialties from '@assets/constants/skills';

@Component({
  selector: 'app-biography',
  templateUrl: './biography.component.html',
  styleUrls: ['./biography.component.scss'],
})
export class BiographyComponent implements OnInit {
  steprSerivce: SteperService = inject(SteperService);
  formBuilder: FormBuilder = inject(FormBuilder);
  userRole: RolesEnum | undefined = undefined;
  RolesEnum = RolesEnum;
  skillsSuggestions: string[] = skillsAndSpecialties;
  filteredSkills: string[] = [];
  toolsSuggestions: string[] = tools;
  filteredTools: string[] = [];

  biographyForm: FormGroup = this.formBuilder.group({
    skills: new FormControl<IStep4['skills'] | null>(
      null,
      Validators.required
    ),
    tools: new FormControl<IStep4['tools'] | null>(
      null,
      Validators.required
    ),
    careerStory: new FormControl<IStep4['story'] | null>(null),
  });

  ngOnInit(): void {
    // Initialize filtered skills and tools with all suggestions
    this.filteredSkills = [...this.skillsSuggestions];
    this.filteredTools = [...this.toolsSuggestions];

    this.steprSerivce.currentStep$.subscribe(step => {
      if (step === 4 && this.steprSerivce.stepsData[3]) {
        this.biographyForm.patchValue(this.steprSerivce.stepsData[3]);
        // Trigger change detection for float labels
        setTimeout(() => {
          const skillsControl = this.biographyForm.get('skills');
          const toolsControl = this.biographyForm.get('tools');
          if (skillsControl?.value && skillsControl.value.length > 0) {
            skillsControl.markAsTouched();
          }
          if (toolsControl?.value && toolsControl.value.length > 0) {
            toolsControl.markAsTouched();
          }
        });
      }
    });

    this.userRole = (this.steprSerivce.stepsData[0] as IStep1).role;
  }
  nextStep() {
    //check if mentor Got to next step else finish
    this.userRole = (this.steprSerivce.stepsData[0] as IStep1).role;

    if (this.biographyForm.invalid) {
      this.biographyForm.markAllAsTouched();
      return;
    }

    if (
      (this.steprSerivce.stepsData[0] as IStep1).role ===
      RolesEnum.MENTOR
    ) {
      this.steprSerivce.nextStep(this.biographyForm.value);
    } else {
      this.steprSerivce.finish(this.biographyForm.value);
    }
  }

  prevStep() {
    this.steprSerivce.previousStep();
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.biographyForm.get(controlName);
    const fieldNames: { [key: string]: string } = {
      skills: 'Skills',
      tools: 'Tools',
      careerStory: 'Career story'
    };
    return getValidationErrorMessage(control, fieldNames[controlName]);
  }

  filterSkills(event: { query: string }): void {
    const query = event.query.toLowerCase();
    const filtered = this.skillsSuggestions.filter(skill =>
      skill.toLowerCase().includes(query)
    );

    // If query doesn't match any suggestion and is not empty, add it as a custom option
    if (query && !this.skillsSuggestions.some(s => s.toLowerCase() === query)) {
      this.filteredSkills = [event.query, ...filtered];
    } else {
      this.filteredSkills = filtered;
    }
  }

  filterTools(event: { query: string }): void {
    const query = event.query.toLowerCase();
    const filtered = this.toolsSuggestions.filter(tool =>
      tool.toLowerCase().includes(query)
    );

    // If query doesn't match any suggestion and is not empty, add it as a custom option
    if (query && !this.toolsSuggestions.some(t => t.toLowerCase() === query)) {
      this.filteredTools = [event.query, ...filtered];
    } else {
      this.filteredTools = filtered;
    }
  }

  onSkillsKeyDown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    // Allow adding custom value on Enter, Tab, or Comma
    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === 'Tab' || keyboardEvent.key === ',') {
      const input = keyboardEvent.target as HTMLInputElement;
      const value = input.value?.trim();

      if (value && value.length > 0) {
        const currentValues = this.biographyForm.get('skills')?.value || [];
        // Check if value doesn't already exist
        if (!currentValues.includes(value)) {
          this.biographyForm.patchValue({
            skills: [...currentValues, value]
          });
          input.value = '';
          keyboardEvent.preventDefault();
        }
      }
    }
  }

  onToolsKeyDown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    // Allow adding custom value on Enter, Tab, or Comma
    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === 'Tab' || keyboardEvent.key === ',') {
      const input = keyboardEvent.target as HTMLInputElement;
      const value = input.value?.trim();

      if (value && value.length > 0) {
        const currentValues = this.biographyForm.get('tools')?.value || [];
        // Check if value doesn't already exist
        if (!currentValues.includes(value)) {
          this.biographyForm.patchValue({
            tools: [...currentValues, value]
          });
          input.value = '';
          keyboardEvent.preventDefault();
        }
      }
    }
  }
}
