import { ReportReviewStatusEnum } from '@core/enums/report-review-status.enum';

export interface IActionItem {
  item: string;
  priority: 'high' | 'medium' | 'low';
}

export interface IReport {
  id: string;
  mentorship_id: string;
  mentor_id: string;
  mentee_id: string;
  period_start_date: string;
  period_end_date: string;
  strength_points: string[];
  weak_points: string[];
  skills_used: string[];
  action_items: IActionItem[];
  commitment_rate: number;
  consistency_rate: number;
  mentee_comments: string | null;
  admin_review_status: ReportReviewStatusEnum;
  admin_review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface IReportCreate {
  mentorship_id: string;
  period_start_date: string;
  period_end_date: string;
  strength_points: string[];
  weak_points: string[];
  skills_used: string[];
  action_items: IActionItem[];
  commitment_rate: number;
  consistency_rate: number;
}

export interface IReportComment {
  report_id: string;
  comment: string;
}

