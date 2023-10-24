import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FooterComponent } from './components/main-layout/footer/footer.component';
import { MainLayoutComponent } from './components/main-layout/main-layout/main-layout.component';
import { NavbarComponent } from './components/main-layout/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FlagPipe } from './pipes/flag.pipe';

@NgModule({
    declarations: [
        NotFoundComponent,
        NavbarComponent,
        FooterComponent,
        MainLayoutComponent,
        FlagPipe,
    ],
    imports: [CommonModule, ButtonModule],
    exports: [NotFoundComponent, MainLayoutComponent, FlagPipe],
})
export class SharedModule {}
