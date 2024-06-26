import {EventEmitter, Injectable, Output, Directive} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBarConfig} from '@angular/material/snack-bar';
import {ExceptionResponse} from '../domain/exception-response';
import {ExceptionModalComponent} from '../ui/common/exception-modal-component/exception-modal.component'

@Directive()
@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {

  constructor(private dialog: MatDialog) {
  }

  @Output() userSendEvent = new EventEmitter<ExceptionResponse>();

  private static from(error: Error, msg: string) {
    return {
      exception: error.error,
      message: msg,
      error: error.error,
      status: error.status,
    } as ExceptionResponse;
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
