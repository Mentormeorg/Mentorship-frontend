import { MentorshipStatusEnum } from '@core/enums/mentorship-status.enum';
import { PaymentStatusEnum } from '@core/enums/payment-status.enum';

export interface IMentorship {
  id: string;
  mentee_id: string;
  mentor_id: string;
  status: MentorshipStatusEnum;
  started_at: string | null;
  ended_at: string | null;
  terminated_at: string | null;
  termination_reason: string | null;
  payment_amount: number;
  payment_currency: string;
  payment_status: PaymentStatusEnum;
  escrow_released_at: string | null;
  refund_amount: number | null;
  refund_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface IMentorshipRequest {
  mentor_id: string;
  payment_amount: number;
  payment_currency?: string;
}

export interface IMentorshipTermination {
  mentorship_id: string;
  reason: string;
}

