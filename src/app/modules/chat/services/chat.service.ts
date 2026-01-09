import { inject, Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SupabaseService } from '@core/services/supabase.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { AuthenticationService } from '@core/services/authentication.service';
import {
  IConversation,
  IMessage,
  IMessageSend,
} from '@core/interfaces/conversation.interface';
import { RealtimeChannel } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private supabase = inject(SupabaseService);
  private errorHandling = inject(ErrorHandlingService);
  private authService = inject(AuthenticationService);

  private activeChannels: Map<string, RealtimeChannel> = new Map();
  private typingChannels: Map<string, RealtimeChannel> = new Map();
  private messageSubjects: Map<string, BehaviorSubject<IMessage[]>> = new Map();

  /**
   * Get all conversations for current user
   */
  getConversations(): Observable<IConversation[]> {
    const user = this.authService.userData.value;
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    return from(
      this.supabase.client
        .from('conversations')
        .select('*')
        .or(`mentee_id.eq.${user.id},mentor_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false })
    ).pipe(
      map((response: { data: IConversation[] | null; error: { message?: string } | null }) => {
        if (response.error) throw response.error;
        return (response.data || []) as IConversation[];
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Get or create conversation by mentorship ID
   */
  getConversationByMentorshipId(
    mentorshipId: string
  ): Observable<IConversation> {
    const user = this.authService.userData.value;
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    return from(
      this.supabase.client
        .from('conversations')
        .select('*')
        .eq('mentorship_id', mentorshipId)
        .single()
    ).pipe(
      switchMap(async (response: { data: IConversation | null; error: { code?: string; message?: string } | null }) => {
        if (response.error && response.error.code !== 'PGRST116') {
          throw response.error;
        }

        // If conversation doesn't exist, create it
        if (response.error?.code === 'PGRST116') {
          // First, get the mentorship to get mentee_id and mentor_id
          const { data: mentorship, error: mentorshipError } =
            await this.supabase.client
              .from('mentorships')
              .select('mentee_id, mentor_id')
              .eq('id', mentorshipId)
              .single();

          if (mentorshipError) throw mentorshipError;

          const { data: newConversation, error: createError } =
            await this.supabase.client
              .from('conversations')
              .insert({
                mentorship_id: mentorshipId,
                mentee_id: mentorship.mentee_id,
                mentor_id: mentorship.mentor_id,
              })
              .select()
              .single();

          if (createError) throw createError;
          return newConversation as IConversation;
        }

        return response.data as IConversation;
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Get messages for a conversation
   */
  getMessages(
    conversationId: string,
    page = 1,
    pageSize = 50
  ): Observable<IMessage[]> {
    const offset = (page - 1) * pageSize;

    return from(
      this.supabase.client
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1)
    ).pipe(
      map((response: { data: IMessage[] | null; error: { message?: string } | null }) => {
        if (response.error) throw response.error;
        const messages = response.data || [];
        return messages.reverse() as IMessage[];
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Send a message
   */
  sendMessage(message: IMessageSend): Observable<IMessage> {
    const user = this.authService.userData.value;
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    return from(
      this.supabase.client
        .from('messages')
        .insert({
          conversation_id: message.conversation_id,
          sender_id: user.id,
          content: message.content,
          message_type: message.message_type || 'text',
          file_url: message.file_url || null,
          file_name: message.file_name || null,
          file_size: message.file_size || null,
        })
        .select()
        .single()
    ).pipe(
      switchMap(async (response: { data: IMessage | null; error: { message?: string } | null }) => {
        if (response.error) throw response.error;

        // Update conversation's last_message_at
        await this.supabase.client
          .from('conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', message.conversation_id);

        return response.data as IMessage;
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Mark messages as read
   */
  markAsRead(conversationId: string): Observable<void> {
    const user = this.authService.userData.value;
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    return from(
      this.supabase.client
        .from('messages')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false)
    ).pipe(
      map((response: { error: { message?: string } | null }) => {
        if (response.error) throw response.error;
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Subscribe to real-time messages for a conversation
   */
  subscribeToMessages(
    conversationId: string
  ): Observable<IMessage> {
    const channelName = `messages:${conversationId}`;

    // Clean up existing channel if any
    if (this.activeChannels.has(channelName)) {
      this.activeChannels.get(channelName)?.unsubscribe();
    }

    // Return observable that emits new messages
    return new Observable<IMessage>((observer) => {
      const channel = this.supabase.client.channel(channelName).on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: { new: IMessage }) => {
          const message = payload.new as IMessage;
          observer.next(message);
        }
      ).subscribe();

      this.activeChannels.set(channelName, channel);

      return () => {
        channel.unsubscribe();
        this.activeChannels.delete(channelName);
      };
    });
  }

  /**
   * Unsubscribe from messages
   */
  unsubscribeFromMessages(conversationId: string): void {
    const channelName = `messages:${conversationId}`;
    const channel = this.activeChannels.get(channelName);
    if (channel) {
      channel.unsubscribe();
      this.activeChannels.delete(channelName);
    }
    this.messageSubjects.delete(conversationId);
    this.unsubscribeFromTypingStatus(conversationId);
  }

  /**
   * Get messages subject for a conversation (for reactive updates)
   */
  getMessagesSubject(conversationId: string): BehaviorSubject<IMessage[]> | null {
    return this.messageSubjects.get(conversationId) || null;
  }

  /**
   * Send typing status to other users in the conversation
   */
  sendTypingStatus(conversationId: string, isTyping: boolean): void {
    const user = this.authService.userData.value;
    if (!user?.id) {
      return;
    }

    const channelName = `typing:${conversationId}`;
    let channel = this.typingChannels.get(channelName);

    if (!channel) {
      channel = this.supabase.client.channel(channelName);
      this.typingChannels.set(channelName, channel);
    }

    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        userId: user.id,
        isTyping,
        conversationId,
      },
    }).catch(() => {
      // Silently fail - typing indicator is not critical
    });
  }

  /**
   * Subscribe to typing status changes for a conversation
   */
  subscribeToTypingStatus(
    conversationId: string
  ): Observable<{ userId: string; isTyping: boolean }> {
    const channelName = `typing:${conversationId}`;

    // Clean up existing channel if any
    if (this.typingChannels.has(channelName)) {
      this.typingChannels.get(channelName)?.unsubscribe();
    }

    return new Observable<{ userId: string; isTyping: boolean }>((observer) => {
      const channel = this.supabase.client
        .channel(channelName)
        .on(
          'broadcast',
          { event: 'typing' },
          (payload: { payload: { userId: string; isTyping: boolean } }) => {
            observer.next(payload.payload);
          }
        )
        .subscribe();

      this.typingChannels.set(channelName, channel);

      return () => {
        channel.unsubscribe();
        this.typingChannels.delete(channelName);
      };
    });
  }

  /**
   * Unsubscribe from typing status
   */
  unsubscribeFromTypingStatus(conversationId: string): void {
    const channelName = `typing:${conversationId}`;
    const channel = this.typingChannels.get(channelName);
    if (channel) {
      channel.unsubscribe();
      this.typingChannels.delete(channelName);
    }
  }
}

