import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes, CanLoad, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./landing-page/home/home.component').then(
                (m) => m.HomeComponent
            ),
    },
    {
        path: 'auth',
        // !! Add Guards to redirect Authenticated users to home 👍
        canLoad: [
            () => {
                inject(AuthenticationService).isAuthenticated.subscribe(
                    (isAuthenticated) => {
                        if (isAuthenticated) {
                            inject(Router).navigate(['home']);
                            return false;
                        }
                        return true;
                    }
                );
            },
        ],
        loadChildren: () =>
            import('./modules/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: '404',
        component: NotFoundComponent,
    },
    {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
