import {Component, OnInit, ViewChild} from '@angular/core';
import {MessagesDataSource} from './messages-data-source';
import {ErrorMessageEntry} from '../../../domain/error-message-entry';
import {MessagesSearchRequest} from '../../../domain/messages-search-request';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
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
import {ErrorViewDirective} from '../../../directive/error-view.directive';

@Component({
    selector: 'app-messages',
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
        ErrorViewDirective,
        MatOptionModule,
        MatSelectModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatPaginatorModule
    ]
})
export class MessagesComponent implements OnInit {
  displayedColumns = ['created', 'type', 'message']
  dataSource: MessagesDataSource
  messageItems: ErrorMessageEntry[]
  messagesSearchModel: MessagesSearchRequest
  searchForm: FormGroup
  showSpinner: boolean
  messagesSort = {}
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator

  constructor(private errorHandler: ErrorHandlerService,
              private adminService: AdminService,
              public fb: FormBuilder,) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      errorType: ['', [Validators.pattern('ALL')]]
    })
    this.dataSource = new MessagesDataSource(this.paginator, this, this.adminService, this.errorHandler)
    this.search();
  }

  onSort($event): void {
    this.messagesSort = $event;
    this.getValuesFromSearchFields();
    if (this.searchForm.valid) {
      this.dataSource.loadData({filter: this.messagesSearchModel, sortColumns: $event});
    }
  }

  search(str?: string): void {
    if (this.searchForm.valid) {
      this.getValuesFromSearchFields()
      if (str) {
        this.dataSource.goToFirstPage()
      }
      this.dataSource.loadData({filter: this.messagesSearchModel, sortColumns: this.messagesSort})
    }
  }

  getValuesFromSearchFields(): void {
    // console.log(JSON.stringify(this.searchForm.controls));
    console.log('Control name type:' + this.searchForm.get('errorType').value);
    // this.messagesSearchModel.errorType = 'ALL'; // this.searchForm.get('errorType').value ? this.searchForm.get('errorType').value : 'ALL';
  }

  pageChanged(): void {
    this.getValuesFromSearchFields();
    this.dataSource.loadData({filter: this.messagesSearchModel, sortColumns: this.messagesSort});
  }
}
