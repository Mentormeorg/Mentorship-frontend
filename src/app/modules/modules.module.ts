import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthSliderComponent } from './auth/layout/components/auth-slider/auth-slider.component';
import { CarouselModule } from 'primeng/carousel';

@NgModule({
    declarations: [AuthSliderComponent],
    imports: [CommonModule, CarouselModule],
    exports: [AuthSliderComponent],
})
export class ModulesModule {}
