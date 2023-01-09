import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map, catchError } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { User } from '../models/User.model';
import { UsersService } from './users.service';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public user!: User
  public users: User[] = []

  constructor(
    private _http:HttpClient,
    private _userService: UsersService
  ) {
    this._userService.getUsers().subscribe((users:User[]) => {
      this.users = users
    })
  }

  get uid():string {
    return this.user._id || '';
  }

  get tenant(): any{

    if(this.user.tenant.length <= 1){
      return this.user.tenant[0]
    }

    return
  }

  login(formData: any){
    return this._http.post(`${base_url}/login`, formData)
          .pipe(
            tap((resp:any) => {
              //const info = JSON.parse(atob(resp.token.split('.')[1]))
              //console.log('info',info);
              //const findUser = this.users.find((user:User) => user._id === info.uid)
              //console.log('findUser',findUser);
              localStorage.setItem('token', resp.token)
            })
          )
  }

  validarToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || ''
    return this._http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap((resp:any) => {
        const {email, last_name, name, role, _id, img, tenant } = resp.user
        this.user = new User(name, last_name, email, tenant ,'', img, role, _id)
        console.log('this.user',this.user);
        localStorage.setItem('token', resp.token)
      }),
      map( resp => true),
      catchError(error => of(false))
    )
  }

  logout(){
    localStorage.removeItem('token')
  }
}
