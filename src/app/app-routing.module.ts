import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes, CanLoad, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

const routes: Routes = [
    // Main Parent Module
    {
        path: '',
        loadChildren: () =>
            import('./modules/modules.module').then((m) => m.ModulesModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
