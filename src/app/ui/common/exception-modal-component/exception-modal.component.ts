import {Component, Inject, OnInit} from '@angular/core';
import {ExceptionResponse} from "../../../domain/exception-response";
import {DatePipe} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-exception-modal-component',
  templateUrl: './exception-modal.component.html',
  styleUrls: ['./exception-modal.component.scss']
})
export class ExceptionModalComponent implements OnInit {

  exceptionResponse: ExceptionResponse;
  time=null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public exceptionResponseDialogRef: MatDialogRef<ExceptionResponse>) {
    this.exceptionResponseDialogRef.disableClose = true;
    this.exceptionResponse = this.data.response;
    if (this.exceptionResponse.timestamp) {
      this.time = new DatePipe("en-US").transform(this.exceptionResponse.timestamp, 'yyyy-MM-dd' +
        ' HH:mm:ss');
    } else if (this.exceptionResponse.timeStamp) {
      this.time = new DatePipe("en-US").transform(this.exceptionResponse.timeStamp, 'yyyy-MM-dd' +
        ' HH:mm:ss');
    } else if(this.time==null) {

    }
  }

  ngOnInit(): void {
  }

  close() {
    this.exceptionResponseDialogRef.close();
  }

}
