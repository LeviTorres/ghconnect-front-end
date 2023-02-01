import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/models/User.model';
import { LoginService } from '../../services/login.service';
import { BusinessService } from '../../services/business.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalQuestionComponent } from '../modal-question/modal-question.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public user!: User
  public letterNames: string = ''
  public business:[] = []
  public userTenant: any
  public tenants:any
  @Input() title:any;

  constructor(
    private _loginService: LoginService,
    private _spinner: NgxSpinnerService,
    private _userService: UsersService,
    private _router: Router,
    private _businessService:BusinessService,
    private _dialog: MatDialog
  ) {
    this.user = _loginService.user
    this.userTenant = _loginService.business
    this.letterNames = `${this.user.name.charAt(0).toUpperCase()}${this.user.last_name.charAt(0).toUpperCase()}`;
   }

  ngOnInit(): void {

  }

  changeTenant(){
    this._dialog.open(ModalQuestionComponent, {
      width: '640px',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      data: this._loginService.business._id
    });
  }
}
