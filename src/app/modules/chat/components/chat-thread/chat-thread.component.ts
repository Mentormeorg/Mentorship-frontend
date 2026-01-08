import { Component, inject, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { IMessage, IConversation } from '@core/interfaces/conversation.interface';
import { CommonModule } from '@angular/common';
import { MessageComposerComponent } from '../message-composer/message-composer.component';

@Component({
  selector: 'app-chat-thread',
  standalone: true,
  imports: [CommonModule, MessageComposerComponent],
  templateUrl: './chat-thread.component.html',
  styleUrls: ['./chat-thread.component.scss'],
})
export class ChatThreadComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private chatService = inject(ChatService);
  private errorHandling = inject(ErrorHandlingService);
  private authService = inject(AuthenticationService);
  private destroy$ = new Subject<void>();

  conversationId: string | null = null;
  conversation: IConversation | null = null;
  messages: IMessage[] = [];
  isLoading = true;
  private shouldScroll = false;

  get currentUserId(): string | null {
    return this.authService.userData.value?.id || null;
  }

  ngOnInit(): void {
    this.conversationId = this.route.snapshot.paramMap.get('id');
    if (this.conversationId) {
      this.loadConversation();
      this.loadMessages();
      this.subscribeToRealtime();
    } else {
      this.errorHandling.handleError('Invalid conversation ID');
      this.router.navigate(['/dashboard/chat']);
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    if (this.conversationId) {
      this.chatService.unsubscribeFromMessages(this.conversationId);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadConversation(): void {
    if (!this.conversationId) return;

    // In a real implementation, you'd fetch conversation details
    // For now, we'll use the ID
    this.conversation = {
      id: this.conversationId,
      mentorship_id: '',
      mentee_id: '',
      mentor_id: '',
      last_message_at: null,
      created_at: '',
      updated_at: '',
    };
  }

  private loadMessages(): void {
    if (!this.conversationId) return;

    this.isLoading = true;
    this.chatService
      .getMessages(this.conversationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.messages = data;
          this.isLoading = false;
          this.shouldScroll = true;
          this.markAsRead();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorHandling.handleError(error);
        },
      });
  }

  private subscribeToRealtime(): void {
    if (!this.conversationId) return;

    this.chatService
      .subscribeToMessages(this.conversationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message) => {
          this.messages = [...this.messages, message];
          this.shouldScroll = true;
          this.markAsRead();
        },
        error: (error) => {
          this.errorHandling.handleError(error);
        },
      });
  }

  private markAsRead(): void {
    if (!this.conversationId) return;

    this.chatService.markAsRead(this.conversationId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      error: (error) => {
        // Silently fail - not critical
        console.error('Failed to mark as read:', error);
      },
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      // Ignore scroll errors
    }
  }

  isMyMessage(message: IMessage): boolean {
    return message.sender_id === this.currentUserId;
  }

  onMessageSent(): void {
    this.shouldScroll = true;
  }
}

