import { MessageTypeEnum } from '@core/enums/message-type.enum';

export interface IConversation {
  id: string;
  mentorship_id: string;
  mentee_id: string;
  mentor_id: string;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface IMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: MessageTypeEnum;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface IMessageSend {
  conversation_id: string;
  content: string;
  message_type?: MessageTypeEnum;
  file_url?: string;
  file_name?: string;
  file_size?: number;
}

