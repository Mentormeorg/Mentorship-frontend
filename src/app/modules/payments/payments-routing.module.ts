import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, registrationCompletionGuard } from '@core/guards';
import { PaymentCheckoutComponent } from './components/payment-checkout/payment-checkout.component';

const routes: Routes = [
  {
    path: 'payments',
    canActivate: [authGuard, registrationCompletionGuard],
    children: [
      {
        path: 'checkout/:mentorshipId',
        component: PaymentCheckoutComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsRoutingModule {}

