import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './_common/not-found/not-found.component';
import { ModulesRoutingModule } from './modules-routing.module';

@NgModule({
    declarations: [NotFoundComponent],
    imports: [CommonModule, ModulesRoutingModule],
    exports: [],
})
export class ModulesModule {}
