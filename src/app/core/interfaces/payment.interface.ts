import { PaymentTransactionStatusEnum } from '@core/enums/payment-transaction-status.enum';

export interface IPayment {
  id: string;
  mentorship_id: string;
  mentee_id: string;
  mentor_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id: string;
  status: PaymentTransactionStatusEnum;
  escrow_released: boolean;
  escrow_released_at: string | null;
  refund_amount: number | null;
  refund_reason: string | null;
  paymob_order_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface IPaymentInitiate {
  mentorship_id: string;
  amount: number;
  currency?: string;
}

export interface IPaymentCallback {
  success: boolean;
  transaction_id?: string;
  error?: string;
}

export interface IRefundRequest {
  mentorship_id: string;
  reason: string;
}

export interface IRefundProcess {
  mentorship_id: string;
  amount: number;
  reason: string;
}

