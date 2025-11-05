import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ErrorsEnum as Errors } from '@core/enums/errors.enum';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  // * refresh token request to get new access token when response status is 401
  // * and retry the request with new access token
  // * if refresh token request fails, logout the user

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // ? client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // ? server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          switch (error.status) {
            case Errors.BAD_REQUEST:
              errorMessage = 'Bad Request';
              break;
            case Errors.UNAUTHORIZED:
              errorMessage = 'Unauthorized';
              // ! refresh Token request to get new access token
              // ! and retry the request with new access token
              // ! if refresh token request fails, logout the user
              break;
            case Errors.FORBIDDEN:
              errorMessage = 'Forbidden';
              break;
            case Errors.NOT_FOUND:
              errorMessage = 'Not Found';
              break;
            case Errors.CONFLICT:
              errorMessage = 'Conflict';
              break;
            default:
              errorMessage = 'Internal Server Error';
              break;
          }
        }
        return throwError(() => errorMessage);
      })
    );
  }
  private unauthorizedHandler() {
    // * refresh Token request to get new access token
    // * and retry the request with new access token
    // * if refresh token request fails, logout the user
  }
}
