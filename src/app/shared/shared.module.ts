import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { flagPipeModule } from 'flag-pipe';

import { FooterComponent } from './components/main-layout/footer/footer.component';
import { MainLayoutComponent } from './components/main-layout/main-layout/main-layout.component';
import { NavbarComponent } from './components/main-layout/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NgPrimeModule } from './ng-prime.module';

@NgModule({
  declarations: [
    NotFoundComponent,
    NavbarComponent,
    FooterComponent,
    MainLayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgPrimeModule,
    flagPipeModule.forRoot({
      config: {
        flagExtensions: 'png',
        flagType: 'WAVY',
        flagSize: '24x18',
      },
    }),
  ],
  exports: [NotFoundComponent, MainLayoutComponent, NgPrimeModule],
})
export class SharedModule {}
