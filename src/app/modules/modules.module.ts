import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulesRoutingModule } from './modules-routing.module';
import { NotFoundComponent } from './common/not-found/not-found.component';

@NgModule({
    declarations: [NotFoundComponent],
    imports: [CommonModule, ModulesRoutingModule],
    exports: [],
})
export class ModulesModule {}
