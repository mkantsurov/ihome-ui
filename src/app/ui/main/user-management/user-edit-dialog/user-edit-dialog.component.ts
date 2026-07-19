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
import { Role, RoleView } from '../../../../domain/role';
import { UserInfo } from '../../../../domain/user-info';

export interface UserEditDialogData {
  mode: 'create' | 'edit';
  user?: UserInfo;
}

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

  allRoles = Object.values(Role).filter(r => r !== Role.NONE);
  RoleView = RoleView;
  conflictError = false;
  isEdit = this.data.mode === 'edit';

  form = this.fb.group({
    username: [this.data.user?.username ?? '', [Validators.required, Validators.minLength(3)]],
    password: ['', this.isEdit ? [] : [Validators.required]],
    roles: [this.data.user?.roles ?? [], [Validators.required]],
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
          roles: roles as Role[],
        })
      : this.userService.create({ username: username!, password: password!, roles: roles as Role[] });

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
