import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UsersService } from '../../../../services/users.service';
import { User } from '../../../../models/User.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public hide: boolean = true;

  public users: any[] = []

  public loginForm = this._fb.group({
    email: [ '', [ Validators.required, Validators.email ] ],
    password: [ '', Validators.required ],
  })

  constructor(
    private _fb: FormBuilder,
    private _loginService: LoginService,
    private _toastr:ToastrService,
    private _router: Router,
    private _userService: UsersService
  ) { }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(){
    this._userService.getUsers().subscribe((users: User[]) => {
      this.users = users
    })
  }

  loginn(){
    this._loginService.login(this.loginForm.value).subscribe( () => {
      const findUser = this.users.find((user:any) => user.email === this.loginForm.controls['email'].value)
      if(findUser?.tenant.length <= 1 ){
        this._router.navigateByUrl('/home')
      }else{
        this._router.navigateByUrl('/tenants')
      }
    }, err => {
      console.warn(err.error.msg);
      this._toastr.error(`${err.error.msg}`)
    })
  }

}
