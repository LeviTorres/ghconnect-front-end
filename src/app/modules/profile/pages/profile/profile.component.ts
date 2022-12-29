import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: any

  constructor(
    private _router: Router,
    private _spinner: NgxSpinnerService,
    private _loginService: LoginService
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

  logOut() {
    this._loginService.logout()
    this._router.navigateByUrl('/login')
  }
}
