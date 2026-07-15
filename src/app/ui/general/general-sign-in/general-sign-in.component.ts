import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {AuthenticationService} from '../../../services/authentication.service';
import {GlobalService} from '../../../services/global.service';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {Role} from '../../../domain/role';


@Component({
    selector: 'app-general-sign-in',
    templateUrl: './general-sign-in.component.html',
    styleUrls: ['./general-sign-in.component.css'],
    imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
]
})
export class GeneralSignInComponent implements OnInit {
  loading = false;
  loginForm: UntypedFormGroup;
  emailForm: UntypedFormGroup;
  loginAttemptErrorMsg: string = null;

  constructor(private router: Router,
              private userService: UserService,
              private globalService: GlobalService,
              protected authenticationService: AuthenticationService,
              public formBuilder: UntypedFormBuilder,
              public dialog: MatDialog) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.emailForm = this.formBuilder.group({
      email: ['email', [Validators.required]]
    })
  }

  private readonly SUMMARY_ROLES: Role[] = [
    Role.ADMIN,
    Role.SUPERVISOR,
    Role.CHILDREN_ROOM1_MANAGER,
    Role.CHILDREN_ROOM2_MANAGER,
  ];

  ngOnInit(): void {
    if (!this.authenticationService.isAuthenticated()) return;

    const roles = this.authenticationService.getRoles();
    if (roles.some(role => this.SUMMARY_ROLES.includes(role))) {
      this.router.navigate(['/main/summary']);
    }
  }

  login() {
    this.loading = true;

    this.authenticationService.login(
      this.loginForm.controls.username.value,
      this.loginForm.controls.password.value).subscribe(
      response => {
        this.loading = false;
        this.globalService.loginEvent.next(true);
        this.loginAttemptErrorMsg = null;
        this.navigateAfterSuccess();
      },
      error => {
        this.loginAttemptErrorMsg = error.error.message;
        // console.log(error);
        this.loading = false;
        console.log('Logging error... ' + this.loginAttemptErrorMsg);
      }
    );
  }

  private navigateAfterSuccess() {
    const roles = this.authenticationService.getRoles();
    if (roles.some(role => this.SUMMARY_ROLES.includes(role))) {
      this.router.navigate(['/main/summary']);
    }
  }

  isFormValid() {
    return !this.loginForm.valid;
  }

}
