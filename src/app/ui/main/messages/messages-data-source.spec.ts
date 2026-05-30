import { MessagesDataSource } from './messages-data-source';
import { MatPaginator } from '@angular/material/paginator';
import { MessagesComponent } from './messages.component';
import { AdminService } from '../../../services/admin.service';
import { ErrorHandlerService } from '../../../services/error-handler.service';

describe('MessagesDataSource', () => {
  it('should create an instance', () => {
    expect(new MessagesDataSource(
      {} as MatPaginator,
      {} as MessagesComponent,
      {} as AdminService,
      {} as ErrorHandlerService
    )).toBeTruthy();
  });
});
