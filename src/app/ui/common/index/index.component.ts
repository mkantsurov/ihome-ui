import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {GlobalService} from "../../../services/global.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  loading: boolean = false;
  loginForm: FormGroup;
  emailForm: FormGroup;
  loginAttemptErrorMsg: string = null;
  //isResetRequestSuccessful: boolean;
  //EMAIL_REGEXP = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';

  @Output() loginEvent = new EventEmitter<void>();

  constructor(
    private router: Router,
    private userService: UserService,
    private globalService: GlobalService,
    private authenticationService: AuthenticationService,
    public formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.emailForm = this.formBuilder.group({
      email: ['email', [Validators.required]]
    })
  }

  ngOnInit() {
    if (this.isTokenExpired()) return;

    if (this.authenticationService.isUser()) {
      this.router.navigate(['/main/summary']);
    } else if (this.authenticationService.isAdmin()) {
      this.router.navigate(['/main/summary']);
    }
  }

  isTokenExpired(): boolean {
    return this.authenticationService.tokenExpired();
  }

  login() {
    this.loading = true;

    this.authenticationService.login(
      this.loginForm.controls['username'].value,
      this.loginForm.controls['password'].value).subscribe(
      response => {
        this.loading = false;
        this.globalService.loginEvent.next(true);
        this.loginAttemptErrorMsg = null;
        this.navigateAfterSuccess();
      },
      error => {
        this.loginAttemptErrorMsg = error.error.message;
        //console.log(error);
        this.loading = false;
      }
    );
  }

  private navigateAfterSuccess() {
    if (this.authenticationService.isAdmin() || this.authenticationService.isUser()) {
      this.router.navigate(['/main/summary']);
    }
  }

  isFormValid() {
    return !this.loginForm.valid;
  }

}
