import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { User } from '../models/User.model';
import { map } from 'rxjs/operators';

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

  getUsers(){
    return this._http.get(`${base_url}/users`,this.headers)
            .pipe(
              map((resp:any) => {
                const users = resp.users.map((user:any) => new User(user.name, user.last_name, user.email, '', user.img, user.role, user._id))
                return {
                  users: users
                }
              })
            )
  }

  deleteUser(user:User){
    console.log(user);

    return this._http.delete(`${base_url}/users/${user._id}`,this.headers)
  }

}
