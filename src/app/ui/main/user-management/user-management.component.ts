import { Component, OnInit, AfterViewInit, viewChild, inject, signal } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../../services/user.service';
import { UserInfo } from '../../../domain/user-info';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { UserEditDialogComponent, UserEditDialogData } from './user-edit-dialog/user-edit-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatPaginatorModule,
    MatInputModule, MatFormFieldModule,
    MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatTooltipModule,
  ],
})
export default class UserManagementComponent implements OnInit, AfterViewInit {
  displayedColumns = ['username', 'roles', 'actions'];
  dataSource = new MatTableDataSource<UserInfo>();
  totalCount = 0;
  filterText = '';
  showSpinner = signal(false);

  readonly paginator = viewChild.required(MatPaginator);

  private userService = inject(UserService);
  private errorHandler = inject(ErrorHandlerService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.showSpinner.set(true);
    this.userService
      .search(this.filterText, this.paginator().pageIndex, this.paginator().pageSize)
      .subscribe({
        next: (res: HttpResponse<UserInfo[]>) => {
          this.totalCount = Number(res.headers.get('X-Total-Count') ?? 0);
          this.dataSource.data = res.body ?? [];
          this.showSpinner.set(false);
        },
        error: (err) => {
          this.showSpinner.set(false);
          this.errorHandler.handle(err, 'Cannot load users');
        },
      });
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(UserEditDialogComponent, {
      data: { mode: 'create' } as UserEditDialogData,
      width: '420px',
    });
    ref.afterClosed().subscribe(result => { if (result) this.loadData(); });
  }

  openEditDialog(user: UserInfo): void {
    const ref = this.dialog.open(UserEditDialogComponent, {
      data: { mode: 'edit', user } as UserEditDialogData,
      width: '420px',
    });
    ref.afterClosed().subscribe(result => { if (result) this.loadData(); });
  }

  deleteUser(user: UserInfo): void {
    if (!confirm(`Delete user "${user.username}"?`)) return;
    this.userService.delete(user.id).subscribe({
      next: () => this.loadData(),
      error: (err) => this.errorHandler.handle(err, 'Cannot delete user'),
    });
  }

  pageChanged(): void { this.loadData(); }

  onFilter(): void {
    this.paginator().firstPage();
    this.loadData();
  }
}
