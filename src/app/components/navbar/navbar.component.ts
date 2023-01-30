import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/models/User.model';
import { LoginService } from '../../services/login.service';
import { BusinessService } from '../../services/business.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';

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
    private _businessService:BusinessService
  ) {
    console.log(window.localStorage.getItem('name-tenant'));
    this.user = _loginService.user
    this.userTenant = _loginService.tenantName
    this.letterNames = `${this.user.name.charAt(0).toUpperCase()}${this.user.last_name.charAt(0).toUpperCase()}`;
   }

  ngOnInit(): void {

  }





}
