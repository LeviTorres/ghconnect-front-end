import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/models/User.model';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public user!: User
  public letterNames: string = ''

  @Input() title:any;

  constructor(
    private _loginService: LoginService,
    private _spinner: NgxSpinnerService
  ) {
    this._spinner.show()
    this.user = _loginService.user
    console.log(this.user.tenant);
    console.log('this._loginService.tenant',this._loginService.tenant);

    this.letterNames = `${this.user.name.charAt(0).toUpperCase()}${this.user.last_name.charAt(0).toUpperCase()}`;
    this._spinner.hide()
   }

  ngOnInit(): void {


  }

}
