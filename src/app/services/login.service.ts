import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map, catchError } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { UserForm } from '../modules/users/interfaces/user-form.interface';
import { User } from '../modules/users/models/User.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public user!: User;

  constructor(
    private _http:HttpClient
  ) { }

  login(formData: any){
    return this._http.post(`${base_url}/login`, formData)
          .pipe(
            tap((resp:any) => {
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
        const {email, last_name, name, role, _id, img } = resp.user
        this.user = new User(name, last_name, email, '', img, role, _id)

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
