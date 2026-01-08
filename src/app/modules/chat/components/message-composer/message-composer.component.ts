import { Component, inject, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { FileUploadService } from '../../services/file-upload.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';
import { MessageTypeEnum } from '@core/enums/message-type.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-composer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './message-composer.component.html',
  styleUrls: ['./message-composer.component.scss'],
})
export class MessageComposerComponent implements OnInit, OnDestroy {
  @Input() conversationId!: string;
  @Output() messageSent = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private chatService = inject(ChatService);
  private fileUploadService = inject(FileUploadService);
  private errorHandling = inject(ErrorHandlingService);
  private destroy$ = new Subject<void>();

  messageForm!: FormGroup;
  selectedFile: File | null = null;
  isUploading = false;
  isSending = false;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.messageForm = this.fb.group({
      content: ['', [Validators.required]],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!this.fileUploadService.validateFileType(file)) {
        this.errorHandling.handleError('Invalid file type');
        return;
      }

      this.selectedFile = file;
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  onEnterKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.onSubmit();
    }
  }

  async onSubmit(): Promise<void> {
    if (this.messageForm.invalid || this.isSending || this.isUploading) {
      return;
    }

    this.isSending = true;
    const content = this.messageForm.get('content')?.value || '';

    try {
      if (this.selectedFile) {
        // Upload file first
        this.isUploading = true;
        const uploadResult = await this.fileUploadService
          .uploadFile(this.selectedFile, this.conversationId)
          .pipe(takeUntil(this.destroy$))
          .toPromise();

        if (!uploadResult) {
          throw new Error('File upload failed');
        }

        // Send message with file
        this.chatService
          .sendMessage({
            conversation_id: this.conversationId,
            content: content || 'File attachment',
            message_type: MessageTypeEnum.FILE,
            file_url: uploadResult.url,
            file_name: uploadResult.fileName,
            file_size: uploadResult.fileSize,
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageForm.reset();
              this.selectedFile = null;
              this.isSending = false;
              this.isUploading = false;
              this.messageSent.emit();
            },
            error: (error) => {
              this.isSending = false;
              this.isUploading = false;
              this.errorHandling.handleError(error);
            },
          });
      } else {
        // Send text message
        this.chatService
          .sendMessage({
            conversation_id: this.conversationId,
            content: content,
            message_type: MessageTypeEnum.TEXT,
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageForm.reset();
              this.isSending = false;
              this.messageSent.emit();
            },
            error: (error) => {
              this.isSending = false;
              this.errorHandling.handleError(error);
            },
          });
      }
    } catch (error) {
      this.isSending = false;
      this.isUploading = false;
      this.errorHandling.handleError(error);
    }
  }
}

