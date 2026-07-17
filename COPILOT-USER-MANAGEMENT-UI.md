# Copilot Instructions — Angular User Management UI for I-Home

## Overview

Implement an Angular user management UI that lets ADMIN users list, create, edit, and delete
I-Home system users. The backend is provided by `UserController` at `/api/v1/users`.

---

## Backend API Contract

### Base URL
```
/api/v1/users
Authorization: Bearer <JWT>   (handled automatically by JwtInterceptor)
```

---

### GET `/api/v1/users` — List / search users (paginated)

**Query parameters:**

| Parameter | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `filter`  | string  | `%`     | Username pattern (SQL LIKE: `%`, `_` wildcards) |
| `page`    | integer | `0`     | 0-based page index |
| `size`    | integer | `20`    | Page size (1–100) |

**Response:** `200 OK`
```json
[
  { "id": 1, "username": "admin", "roles": ["ADMIN"] },
  { "id": 2, "username": "john",  "roles": ["UNDEFINED"] }
]
```
Header: `X-Total-Count: 42` (total matched records — use for paginator)

---

### POST `/api/v1/users/search` — Structured search (paginated)

**Query parameters:** same `page` / `size` as above.

**Request body:** array of `SearchParam` filters (may be empty / null for "all").

```json
[
  { "key": "USERNAME", "predicat": "ilike", "values": ["adm"] },
  { "key": "ROLE",     "predicat": "=",     "values": ["ADMIN"] }
]
```

Supported `key` values: `USERNAME`, `ROLE`

Supported `predicat` values:

| Predicat   | Meaning |
|------------|---------|
| `=`        | exact match |
| `!=`       | not equal |
| `like`     | SQL LIKE (`%value%`) |
| `ilike`    | case-insensitive LIKE |
| `llike`    | left LIKE (`%value`) |
| `rlike`    | right LIKE (`value%`) |
| `lIlike`   | left case-insensitive LIKE |
| `rIlike`   | right case-insensitive LIKE |
| `in`       | value in list |
| `not in`   | value not in list |

**Response:** `200 OK` — same shape as GET, with `X-Total-Count` header.

---

### GET `/api/v1/users/{userId}` — Get single user

**Response:**
- `200 OK` — `UserInfo` object
- `404 Not Found` — user does not exist

---

### POST `/api/v1/users` — Create user *(ADMIN only)*

**Request body:**
```json
{ "username": "newuser", "password": "s3cr3t", "roles": ["UNDEFINED"] }
```

**Response:**
- `201 Created` — created `UserInfo`
- `409 Conflict` — username already taken

---

### PUT `/api/v1/users/{userId}` — Update user *(ADMIN only)*

**Request body** (null fields are ignored — partial update):
```json
{ "username": "renamed", "password": "newpass", "roles": ["ADMIN"] }
```

**Response:**
- `200 OK` — updated `UserInfo`
- `404 Not Found` — user does not exist
- `409 Conflict` — new username already taken by another user

---

### DELETE `/api/v1/users/{userId}` — Delete user *(ADMIN only)*

**Response:**
- `204 No Content` — deleted
- `404 Not Found` — user does not exist

---

## Role Enum

The backend `Role` enum has exactly two values:

```
ADMIN      — full administrative access
UNDEFINED  — regular / non-admin authenticated user
```

The Angular `Role` enum in `src/app/domain/role.ts` uses different values (UI roles).  
Create a **separate** `UserRole` enum for the user management domain:

```typescript
// src/app/domain/user-role.ts
export enum UserRole {
  ADMIN     = 'ADMIN',
  UNDEFINED = 'UNDEFINED',
}
```

---

## Files to Create

```
ihome-ui/src/app/
├── services/
│   └── user.service.ts                         # HTTP service wrapping /api/v1/users
├── domain/
│   ├── user-info.ts                            # { id: number; username: string; roles: UserRole[] }
│   ├── user-role.ts                            # enum UserRole { ADMIN, UNDEFINED }
│   ├── create-user-request.ts                  # { username; password; roles }
│   ├── update-user-request.ts                  # { username?; password?; roles? }
│   └── search-param.ts                         # { key: string; predicat: string; values: string[] }
└── ui/main/
    └── user-management/
        ├── user-management.component.ts
        ├── user-management.component.html
        ├── user-management.component.scss
        └── user-edit-dialog/
            ├── user-edit-dialog.component.ts   # MatDialog for create / edit
            └── user-edit-dialog.component.html
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/app/ui/main/main-sidenav/menu-items.ts` | Add `user-management` menu item |
| `src/app/app-routing.module.ts` | Add `/main/user-management` route |

---

## Domain Models

### `src/app/domain/user-role.ts`
```typescript
export enum UserRole {
  ADMIN     = 'ADMIN',
  UNDEFINED = 'UNDEFINED',
}
```

### `src/app/domain/user-info.ts`
```typescript
import { UserRole } from './user-role';
export interface UserInfo {
  id: number;
  username: string;
  roles: UserRole[];
}
```

### `src/app/domain/create-user-request.ts`
```typescript
import { UserRole } from './user-role';
export interface CreateUserRequest {
  username: string;
  password: string;
  roles: UserRole[];
}
```

### `src/app/domain/update-user-request.ts`
```typescript
import { UserRole } from './user-role';
export interface UpdateUserRequest {
  username?: string;
  password?: string;
  roles?: UserRole[];
}
```

### `src/app/domain/search-param.ts`
```typescript
export interface SearchParam {
  key: string;       // 'USERNAME' | 'ROLE'
  predicat: string;  // 'ilike', '=', 'in', etc.
  values: string[];
}
```

---

## User Service

### `src/app/services/user.service.ts`
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfo } from '../domain/user-info';
import { CreateUserRequest } from '../domain/create-user-request';
import { UpdateUserRequest } from '../domain/update-user-request';
import { SearchParam } from '../domain/search-param';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = '/api/v1/users';
  private http = inject(HttpClient);

  /** List users with optional username pattern filter, paginated. */
  search(filter: string, page: number, size: number): Observable<HttpResponse<UserInfo[]>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filter) params = params.set('filter', filter);
    return this.http.get<UserInfo[]>(this.baseUrl, { params, observe: 'response' });
  }

  /** Structured search by SearchParam filters, paginated. */
  searchByFilters(filters: SearchParam[], page: number, size: number): Observable<HttpResponse<UserInfo[]>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.post<UserInfo[]>(`${this.baseUrl}/search`, filters, { params, observe: 'response' });
  }

  getById(id: number): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/${id}`);
  }

  create(req: CreateUserRequest): Observable<UserInfo> {
    return this.http.post<UserInfo>(this.baseUrl, req);
  }

  update(id: number, req: UpdateUserRequest): Observable<UserInfo> {
    return this.http.put<UserInfo>(`${this.baseUrl}/${id}`, req);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

---

## User Management Component

### Requirements
- Standalone component with `MatTableModule` paginated table (matches `MessagesComponent` pattern).
- Columns: **Username**, **Roles**, **Actions** (edit / delete buttons — ADMIN only).
- Filter text input above the table for username pattern search.
- "Add User" button (ADMIN only) opens the edit dialog in create mode.
- Edit icon button per row opens the edit dialog in edit mode.
- Delete icon button per row shows `MatDialog` confirmation before calling `DELETE`.
- Pagination via `MatPaginator` — read `X-Total-Count` response header.
- Show a spinner while loading.
- Show inline error via `ErrorHandlerService` on failures.

### Component skeleton (`user-management.component.ts`)
```typescript
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
```

### Template (`user-management.component.html`)
```html
<div class="page-header">
  <h3>User Management</h3>
  <button mat-raised-button color="primary" (click)="openCreateDialog()">
    <mat-icon>person_add</mat-icon> Add User
  </button>
</div>

<div class="filter-row">
  <mat-form-field appearance="outline">
    <mat-label>Filter by username</mat-label>
    <input matInput [(ngModel)]="filterText" (ngModelChange)="onFilter()" placeholder="e.g. adm%" />
    <mat-icon matSuffix>search</mat-icon>
  </mat-form-field>
</div>

@if (showSpinner()) {
  <mat-spinner diameter="40" />
}

<mat-table [dataSource]="dataSource">

  <ng-container matColumnDef="username">
    <mat-header-cell *matHeaderCellDef>Username</mat-header-cell>
    <mat-cell *matCellDef="let row">{{ row.username }}</mat-cell>
  </ng-container>

  <ng-container matColumnDef="roles">
    <mat-header-cell *matHeaderCellDef>Roles</mat-header-cell>
    <mat-cell *matCellDef="let row">{{ row.roles.join(', ') }}</mat-cell>
  </ng-container>

  <ng-container matColumnDef="actions">
    <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
    <mat-cell *matCellDef="let row">
      <button mat-icon-button matTooltip="Edit" (click)="openEditDialog(row)">
        <mat-icon>edit</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Delete" color="warn" (click)="deleteUser(row)">
        <mat-icon>delete</mat-icon>
      </button>
    </mat-cell>
  </ng-container>

  <mat-header-row *matHeaderRowDef="displayedColumns" />
  <mat-row *matRowDef="let row; columns: displayedColumns;" />
</mat-table>

<mat-paginator
  [length]="totalCount"
  [pageSize]="20"
  [pageSizeOptions]="[10, 20, 50]"
  (page)="pageChanged()" />
```

---

## User Edit Dialog Component

### Data interface
```typescript
export interface UserEditDialogData {
  mode: 'create' | 'edit';
  user?: UserInfo;
}
```

### Requirements
- Reactive form (`ReactiveFormsModule`) with fields:
  - **Username** — required, min 3 chars
  - **Password** — required on create, optional on edit (leave blank to keep unchanged)
  - **Roles** — `MatSelectModule` multi-select with `UserRole.ADMIN` and `UserRole.UNDEFINED` options
- On submit:
  - **create mode** → call `userService.create(...)` → close dialog with `true`
  - **edit mode** → build `UpdateUserRequest` with only non-null changed fields → call `userService.update(id, ...)` → close dialog with `true`
- Handle `409 Conflict` explicitly: show "Username already taken" error in the form.
- Cancel button closes dialog with no value.

### Component skeleton (`user-edit-dialog.component.ts`)
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../../services/user.service';
import { UserRole } from '../../../../domain/user-role';
import { UserEditDialogData } from './user-edit-dialog.component';

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  templateUrl: './user-edit-dialog.component.html',
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule,
  ],
})
export class UserEditDialogComponent implements OnInit {
  readonly data: UserEditDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<UserEditDialogComponent>);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  allRoles = Object.values(UserRole);
  conflictError = false;
  isEdit = this.data.mode === 'edit';

  form = this.fb.group({
    username: [this.data.user?.username ?? '', [Validators.required, Validators.minLength(3)]],
    password: ['', this.isEdit ? [] : [Validators.required]],
    roles: [this.data.user?.roles ?? [UserRole.UNDEFINED], [Validators.required]],
  });

  ngOnInit(): void {}

  submit(): void {
    if (this.form.invalid) return;
    this.conflictError = false;
    const { username, password, roles } = this.form.value;

    const obs = this.isEdit
      ? this.userService.update(this.data.user!.id, {
          username: username || undefined,
          password: password || undefined,
          roles: roles as UserRole[],
        })
      : this.userService.create({ username: username!, password: password!, roles: roles as UserRole[] });

    obs.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.conflictError = true;
        }
      },
    });
  }

  cancel(): void { this.dialogRef.close(); }
}
```

### Dialog template (`user-edit-dialog.component.html`)
```html
<h2 mat-dialog-title>{{ isEdit ? 'Edit User' : 'Create User' }}</h2>

<mat-dialog-content [formGroup]="form">

  <mat-form-field appearance="outline" class="full-width">
    <mat-label>Username</mat-label>
    <input matInput formControlName="username" autocomplete="off" />
    @if (form.controls.username.hasError('required')) {
      <mat-error>Username is required</mat-error>
    }
    @if (form.controls.username.hasError('minlength')) {
      <mat-error>At least 3 characters</mat-error>
    }
    @if (conflictError) {
      <mat-error>Username already taken</mat-error>
    }
  </mat-form-field>

  <mat-form-field appearance="outline" class="full-width">
    <mat-label>{{ isEdit ? 'New Password (leave blank to keep)' : 'Password' }}</mat-label>
    <input matInput type="password" formControlName="password" autocomplete="new-password" />
    @if (form.controls.password.hasError('required')) {
      <mat-error>Password is required</mat-error>
    }
  </mat-form-field>

  <mat-form-field appearance="outline" class="full-width">
    <mat-label>Roles</mat-label>
    <mat-select formControlName="roles" multiple>
      @for (role of allRoles; track role) {
        <mat-option [value]="role">{{ role }}</mat-option>
      }
    </mat-select>
  </mat-form-field>

</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-button (click)="cancel()">Cancel</button>
  <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="submit()">
    {{ isEdit ? 'Save' : 'Create' }}
  </button>
</mat-dialog-actions>
```

---

## Routing

### `src/app/app-routing.module.ts` — add inside `routes` / `main` children:
```typescript
{ path: 'user-management', loadComponent: () => import('./ui/main/user-management/user-management.component') },
```

---

## Side-Navigation Menu

### `src/app/ui/main/main-sidenav/menu-items.ts` — add entry (ADMIN only):
```typescript
{
  icon: 'manage_accounts',
  label: 'Users',
  route: 'user-management',
  implemented: true,
  roles: [Role.ADMIN],
},
```
Place it after "Messages" and before "Sign-Out".

---

## Conventions to Follow

| Convention | Detail |
|---|---|
| Component style | `standalone: true` with explicit `imports` array |
| Template control flow | Angular 17+ `@for`, `@if` syntax (not `*ngFor`, `*ngIf`) |
| Signals | Use `signal()` for loading/spinner state |
| `viewChild` | Use `viewChild.required(MatPaginator)` (not `@ViewChild`) |
| HTTP | Use `observe: 'response'` to access `X-Total-Count` header |
| Pagination | Read `X-Total-Count` from `HttpResponse.headers` (not response body) |
| SCSS | `@use '@angular/material' as mat;` at top |
| Lazy loading | Use `loadComponent: () => import(...)` for the route |
| Dialog | Use `MatDialog.open()` — component must be standalone |
| Error handling | Use `ErrorHandlerService.handle(err, msg)` for non-conflict errors |

---

## Notes

- **`Role` naming collision** — the existing `src/app/domain/role.ts` contains UI navigation roles (`ADMIN`, `SUPERVISOR`, etc.). The backend `Role` enum has only `ADMIN` and `UNDEFINED`. Use the new `UserRole` enum (`src/app/domain/user-role.ts`) exclusively in all user management files to avoid confusion.
- **Password never returned** — `UserInfo` response never contains a password field. The password field is only sent in `CreateUserRequest` / `UpdateUserRequest`.
- **Partial update** — on edit, only send fields that have changed. Pass `undefined` (not `null`) for unchanged fields so they serialize to absent JSON properties. The backend ignores `null` fields for username/password but you should send only what changed.
- **`X-Total-Count` exposure** — the backend explicitly sets `Access-Control-Expose-Headers: X-Total-Count`, so the header is readable cross-origin. Angular's `HttpResponse` will have it.
- **Delete confirmation** — use `confirm()` dialog or a `MatDialog` confirmation component. A simple `confirm()` is acceptable for admin-only UI.
- **Search filter** — the simple `GET /api/v1/users?filter=` supports SQL LIKE patterns. For role-based filtering use `POST /api/v1/users/search`. Start with the simple GET endpoint; add structured search only if role filtering is needed in the UI.
