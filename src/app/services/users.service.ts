import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { User } from '../models/User.model';
import { map, tap } from 'rxjs/operators';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private _http: HttpClient
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get tenant(): string {
    return localStorage.getItem('tenant') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  createUser(formData: any) {
    return this._http.post(`${base_url}/users`, formData)
  }

  createUserWorspace( formData: any ) {

    return this._http.post(`${ base_url }/users`, formData )
              .pipe(
                tap( (resp: any) => {
                  localStorage.setItem('token', resp.token )

                }),
                map((resp:any) => resp.user)
              )
  }

  updateUserWorkspace(formData: any, _id:string) {
    return this._http.put(`${base_url}/users/${ _id}`, formData)
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token )
        }),
        map((resp:any) => {
          return resp.userUpdated
        })
      )
  }

  getUsers(){
    return this._http.get(`${base_url}/users`,this.headers)
            .pipe(
              map((resp:any) => {
                return resp.users
              })
            )
  }

  updateUser(formData: any, _id:string) {
    return this._http.put(`${base_url}/users/${ _id}`, formData, this.headers)
                .pipe(
                  tap( (resp: any) => {
                    //localStorage.setItem('token', resp.token )
                  }),
                  map((resp:any) => {
                    return resp
                  })
                )
  }

  deleteUser(user:User){
    return this._http.delete(`${base_url}/users/${user._id}`,this.headers)
  }

}
