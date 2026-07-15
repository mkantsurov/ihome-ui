import {Component, viewChild, OnInit, AfterViewInit} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {HttpParams} from '@angular/common/http';
import {ErrorMessageEntry} from '../../../domain/error-message-entry';
import {MessagesSearchRequest} from '../../../domain/messages-search-request';
import {ErrorMessageSortRule} from '../../../domain/error-message-sort-rule';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {CustomHttpParamEncoder} from '../../../services/custom-http-param-encoder';
import {AdminService} from '../../../services/admin.service';
import {ErrorHandlerService, Error} from '../../../services/error-handler.service';
import {DatePipe} from '@angular/common';
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
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {ErrorViewDirective} from '../../../directive/error-view.directive';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  standalone: true,
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
export class MessagesComponent implements OnInit, AfterViewInit {
  displayedColumns = ['created', 'type', 'message']
  dataSource = new MatTableDataSource<ErrorMessageEntry>()
  totalCount = 0
  messageItems: ErrorMessageEntry[]
  messagesSearchModel: MessagesSearchRequest
  searchForm: FormGroup
  showSpinner = false
  messagesSort = {}
  readonly paginator = viewChild.required(MatPaginator)

  constructor(private errorHandler: ErrorHandlerService,
              private adminService: AdminService,
              public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      errorType: ['']
    })
  }

  ngAfterViewInit(): void {
    this.getValuesFromSearchFields();
    this.loadData({filter: this.messagesSearchModel, sortColumns: this.messagesSort});
  }

  private static updateFilterHttpParams(filter: string[], value: any): void {
    if (value.filter && value.filter.errorType) {
      filter.push('type=' + value.filter.errorType)
    }
  }

  private static updateSortHttpParams(sort: string[], value: any): void {
    if (value.sortColumns) {
      if (value.sortColumns.active === 'created' && value.sortColumns.direction === 'asc') {
        sort.push(ErrorMessageSortRule.CREATED_ASC)
      }
      if (value.sortColumns.active === 'created' && value.sortColumns.direction === 'desc') {
        sort.push(ErrorMessageSortRule.CREATED_DESC)
      }
    }
  }

  private static httpParamsFrom(filter?: string[], sort?: string[]): HttpParams {
    let httpParams = new HttpParams({ encoder: new CustomHttpParamEncoder() })
    if (filter) {
      filter.forEach(value => httpParams = httpParams.append('filter', value))
    }
    if (sort) {
      sort.forEach(value => httpParams = httpParams.append('sort', value))
    }
    return httpParams
  }

  loadData(value: any): void {
    setTimeout(() => this.showSpinner = true)

    const filter: string[] = []
    const sort: string[] = []

    MessagesComponent.updateFilterHttpParams(filter, value)
    MessagesComponent.updateSortHttpParams(sort, value)
    this.adminService.getErrorCount(MessagesComponent.httpParamsFrom(filter, null)).pipe(
      switchMap((count) => {
        this.totalCount = count.headers.get('x-total-count')
        return this.adminService.searchErrors(this.paginator().pageIndex,
          this.paginator().pageSize,
          MessagesComponent.httpParamsFrom(filter, sort))
      })
    ).subscribe((errors) => {
      this.dataSource.data = errors
      this.showSpinner = false
    }, (error: Error) => {
      this.dataSource.data = []
      this.showSpinner = false
      this.errorHandler.handle(error, ' Cannot get error messages ')
    })
  }

  goToFirstPage(): void {
    this.paginator().firstPage()
  }

  onSort($event): void {
    this.messagesSort = $event;
    this.getValuesFromSearchFields();
    if (this.searchForm.valid) {
      this.loadData({filter: this.messagesSearchModel, sortColumns: $event});
    }
  }

  search(str?: string): void {
    if (this.searchForm.valid) {
      this.getValuesFromSearchFields()
      if (str) {
        this.paginator().firstPage()
      }
    }
  }

  getValuesFromSearchFields(): void {
    this.messagesSearchModel = new MessagesSearchRequest();
    this.messagesSearchModel.errorType = this.searchForm.get('errorType').value || undefined;
  }

  pageChanged(): void {
    this.getValuesFromSearchFields();
    this.loadData({filter: this.messagesSearchModel, sortColumns: this.messagesSort});
  }
}
