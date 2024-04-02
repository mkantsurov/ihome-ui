import {EventEmitter, Injectable, Output, Directive} from '@angular/core';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {MatLegacySnackBarConfig as MatSnackBarConfig} from '@angular/material/legacy-snack-bar';
import {ExceptionResponse} from '../domain/exception-response';
import {ExceptionModalComponent} from '../ui/common/exception-modal-component/exception-modal.component'

@Directive()
@Injectable()
export class ErrorHandlerService {

  constructor(private dialog: MatDialog) {
  }

  @Output() userSendEvent = new EventEmitter<ExceptionResponse>();

  private static from(error: Error, message: string) {
    return new class implements ExceptionResponse {
      exception = error.error;
      errorDetails = error.errorDetails;
      message = message;
    };
  }


  handle(error: Error, message: string, config?: MatSnackBarConfig) {
    const errorElement = error.error;
    if (typeof errorElement === 'string' || errorElement instanceof String) {
      this.dialog.open(ExceptionModalComponent, {
        data: {
          response: ErrorHandlerService.from(error, message)
        }
      });
    } else {
      const exceptionInfo: ExceptionResponse = error.error;
      this.dialog.open(ExceptionModalComponent, {
        data: {
          response: exceptionInfo
        }
      });
    }
  }
}


export interface Error {
  statusText?,
  ok?,
  status?,
  type?,
  url?,
  _body?,
  error?,
  headers?: any
}
