import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public hide: boolean = true;

  public loginForm = this._fb.group({
    email: [ '', [ Validators.required, Validators.email ] ],
    password: [ '', Validators.required ],
  })

  constructor(
    private _fb: FormBuilder,
    private _loginService: LoginService,
    private _toastr:ToastrService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  loginn(){
    this._loginService.login(this.loginForm.value).subscribe( () => {
      this._router.navigateByUrl('/home')
    }, err => {
      console.warn(err.error.msg);
      this._toastr.error(`${err.error.msg}`)
    })
  }

}
