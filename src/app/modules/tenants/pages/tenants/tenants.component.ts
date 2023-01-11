import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/User.model';
import { UsersService } from '../../../../services/users.service';
import { LoginService } from '../../../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss']
})
export class TenantsComponent implements OnInit {

  public user!: any

  constructor(
    private _userService: UsersService,
    private _loginService: LoginService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(){
    this._userService.getUsers().subscribe((users:User[]) => {
      this.user = users.find((user: User) => user._id === this._loginService.uid)
    })
  }

  async goToHomeWithTenant(name: string){
    this._loginService.changeTenant(name)
    this._router.navigateByUrl('/home')
  }

}
