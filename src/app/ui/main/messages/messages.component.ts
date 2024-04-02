import { Component, OnInit } from '@angular/core';
import {MessagesDataSource} from './messages-data-source';
import {ErrorMessageEntry} from '../../../domain/error-message-entry';
import {MessagesSearchRequest} from '../../../domain/messages-search-request';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  displayedColumns = ['created', 'type', 'message']
  dataSource: MessagesDataSource
  messageItems: ErrorMessageEntry[]
  messagesSearchModel: MessagesSearchRequest
  searchForm: FormGroup
  showSpinner: boolean
  messagesSort = {}
  constructor() { }

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
