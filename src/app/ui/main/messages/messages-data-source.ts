import {ErrorMessageEntry} from '../../../domain/error-message-entry';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {ErrorHandlerService} from '../../../services/error-handler.service';
import {AdminService} from '../../../services/admin.service';
import {MatLegacyPaginator as MatPaginator} from '@angular/material/legacy-paginator';
import {MessagesComponent} from './messages.component';
import {ErrorMessageSortRule} from '../../../domain/error-message-sort-rule';
import {HttpParams} from '@angular/common/http';
import {CustomHttpParamEncoder} from '../../../services/custom-http-param-encoder';
import {switchMap} from 'rxjs/operators';

export class MessagesDataSource implements DataSource<ErrorMessageEntry> {
  private dataSubject = new BehaviorSubject<ErrorMessageEntry[]>([])
  private loadingSubject = new BehaviorSubject<boolean>(false)
  public totalCount: number
  request: any
  constructor(private paginator: MatPaginator,
              private parent: MessagesComponent,
              private adminServive: AdminService,
              private errorHandler: ErrorHandlerService) {
  }
  private static updateFilterHttpParams(filter: string[], value: any): void {
    if (value.filter) {
      if (value.filter.role) {
        filter.push('type=' + value.filter.type)
      }
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
      sort = sort.map(value => value.toUpperCase())
    }
  }

  private concat(value: string): string {
    return value.toUpperCase()
  }

  private static httpParamsFrom(filter?: string[], sort?: string[]): HttpParams {
    let httpParams = new HttpParams({encoder: new CustomHttpParamEncoder()})
    if (filter) {
      filter.forEach(value => httpParams = httpParams.append('filter', value))
    }
    if (sort) {
      sort.forEach(value => httpParams = httpParams.append('sort', value))
    }
    return httpParams
  }

  loadData(value: any): void {
    this.request = value
    this.loadingSubject.next(true)

    const filter: string[] = []
    const sort: string[] = []

    MessagesDataSource.updateFilterHttpParams(filter, value)
    MessagesDataSource.updateSortHttpParams(sort, value)

    this.adminServive.getErrorCount(MessagesDataSource.httpParamsFrom(filter, null)).pipe(
      switchMap((count) => {
        this.totalCount = count.headers.get('x-total-count')
        return this.adminServive.searchErrors(this.paginator.pageIndex, this.paginator.pageSize, MessagesDataSource.httpParamsFrom(filter, sort))
      })
    ).subscribe((users) => {
      this.dataSubject.next(users)
    }, (error: Error) => {
      this.dataSubject.next([])
      this.errorHandler.handle(error, ' Cannot get error messages ')
    })
  }

  goToFirstPage(): void {
    this.paginator.firstPage()
  }

  connect(collectionViewer: CollectionViewer): Observable<ErrorMessageEntry[]> {
    return this.dataSubject.asObservable()
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete()
    this.loadingSubject.complete()
  }
}
