import { MentorApplicationStatusEnum } from '@core/enums/mentor-application-status.enum';

export interface IMentorApplication {
  id: string;
  user_id: string;
  status: MentorApplicationStatusEnum;
  application_data: Record<string, unknown>;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface IMentorApplicationSubmit {
  application_data: Record<string, unknown>;
}

export interface IMentorApplicationReview {
  application_id: string;
  status: MentorApplicationStatusEnum;
  rejection_reason?: string;
}

