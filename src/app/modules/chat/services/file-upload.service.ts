import { inject, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SupabaseService } from '@core/services/supabase.service';
import { ErrorHandlingService } from '@core/services/error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private supabase = inject(SupabaseService);
  private errorHandling = inject(ErrorHandlingService);
  private readonly bucketName = 'mentorship-files';
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  /**
   * Upload a file to Supabase Storage
   */
  uploadFile(file: File, mentorshipId: string): Observable<{
    url: string;
    fileName: string;
    fileSize: number;
  }> {
    // Validate file size
    if (file.size > this.maxFileSize) {
      throw new Error(`File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`);
    }

    const fileName = `${mentorshipId}/${Date.now()}_${file.name}`;
    const filePath = `${fileName}`;

    return from(
      this.supabase.client.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })
    ).pipe(
      switchMap((response: { error: { message?: string } | null }) => {
        if (response.error) throw response.error;

        // Get public URL
        const { data: urlData } = this.supabase.client.storage
          .from(this.bucketName)
          .getPublicUrl(filePath);

        return of({
          url: urlData.publicUrl,
          fileName: file.name,
          fileSize: file.size,
        });
      }),
      catchError((error) => {
        this.errorHandling.handleError(error);
        throw error;
      })
    );
  }

  /**
   * Delete a file from Supabase Storage
   */
  deleteFile(filePath: string): Observable<void> {
    return from(
      this.supabase.client.storage
        .from(this.bucketName)
        .remove([filePath])
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
   * Get allowed file types
   */
  getAllowedFileTypes(): string[] {
    return [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/zip',
    ];
  }

  /**
   * Validate file type
   */
  validateFileType(file: File): boolean {
    const allowedTypes = this.getAllowedFileTypes();
    return allowedTypes.includes(file.type);
  }
}

