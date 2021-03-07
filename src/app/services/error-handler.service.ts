import { EventEmitter, Injectable, Output, Directive } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBarConfig } from "@angular/material/snack-bar";
import {ExceptionResponse} from "../domain/exception-response";
import {ExceptionModalComponent} from "../ui/common/exception-modal-component/exception-modal.component"

@Directive()
@Injectable()
export class ErrorHandlerService {

    @Output() userSendEvent = new EventEmitter<ExceptionResponse>();

    constructor(private dialog: MatDialog) {
    }

    handle(error: Error, message: string, config?: MatSnackBarConfig) {
        let errorElement = error['error'];
        if (typeof errorElement === 'string' || errorElement instanceof String) {
            this.dialog.open(ExceptionModalComponent, {
                data: {
                    response: ErrorHandlerService.from(error, message)
                }
            });
        } else {
            let exceptionInfo: ExceptionResponse = error['error'];
            this.dialog.open(ExceptionModalComponent, {
                data: {
                    response: exceptionInfo
                }
            });
        }
    }

    private static from(error: Error, message: string) {
        return new class implements ExceptionResponse {
            exception = error['error'];
            errorDetails = error['errorDetails']
            message = message;
        };
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
