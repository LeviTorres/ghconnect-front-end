import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-menu-navbar',
  templateUrl: './menu-navbar.component.html',
  styleUrls: ['./menu-navbar.component.scss']
})
export class MenuNavbarComponent implements OnInit {

  public user: any


  constructor(
    private _loginService: LoginService,
    private _router:Router,
    private _spinner: NgxSpinnerService
  ) {
    this._spinner.show()
    this.user = _loginService.user
    this._spinner.hide()
  }

  ngOnInit(): void {
  }

  getRole(role: string) {
    if (role === 'ADMIN_ROLE') {
      return 'Administrador'
    }
    return
  }

  logOut(){
    this._loginService.logout()
    this._router.navigateByUrl('/login')
  }

}
