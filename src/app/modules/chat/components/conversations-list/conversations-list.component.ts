import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { IConversation } from '@core/interfaces/conversation.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversations-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.scss'],
})
export class ConversationsListComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private chatService = inject(ChatService);
  private errorHandling = inject(ErrorHandlingService);
  private destroy$ = new Subject<void>();

  conversations: IConversation[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadConversations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadConversations(): void {
    this.isLoading = true;
    this.chatService
      .getConversations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.conversations = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorHandling.handleError(error);
        },
      });
  }

  openConversation(conversationId: string): void {
    this.router.navigate(['/dashboard/chat', conversationId]);
  }
}

