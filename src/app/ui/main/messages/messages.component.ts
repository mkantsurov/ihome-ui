import { Component, OnInit } from '@angular/core';
import {MessagesDataSource} from './messages-data-source';
import {ErrorMessageEntry} from '../../../domain/error-message-entry';
import {MessagesSearchRequest} from '../../../domain/messages-search-request';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {AdminService} from '../../../services/admin.service';
import {ErrorHandlerService} from '../../../services/error-handler.service';
import {DatePipe, NgClass} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-messages',
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    DatePipe,
    MatOptionModule,
    MatSelectModule,
    MatSortModule,
    MatProgressSpinnerModule,
    NgClass,
    MatPaginatorModule
  ],
})
export class MessagesComponent implements OnInit {
  displayedColumns = ['created', 'type', 'message']
  dataSource: MessagesDataSource
  messageItems: ErrorMessageEntry[]
  messagesSearchModel: MessagesSearchRequest
  searchForm: FormGroup
  showSpinner: boolean
  messagesSort = {}
  constructor(private errorHandler: ErrorHandlerService,
              private adminService: AdminService) { }

  ngOnInit(): void {
  }

  onSort($event): void {
    this.messagesSort = $event;
    this.getValuesFromSearchFields();
    if (this.searchForm.valid) {
      this.dataSource.loadData({filter: this.messagesSearchModel, sortColumns: $event});
    }
  }
  getValuesFromSearchFields(): void {
    this.messagesSearchModel.type = this.searchForm.get('type').value
  }

  pageChanged(): void {
    this.getValuesFromSearchFields();
    this.dataSource.loadData({filter: this.messagesSearchModel, sortColumns: this.messagesSort});
  }
}
