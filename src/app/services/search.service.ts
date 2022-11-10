import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../models/User.model';
import { Divisa } from '../models/Divisa.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private _http: HttpClient,

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

  private generateUsers(users: any[]): User[]{
    console.log('users',users);

    return users.map(
      user => new User(user.name, user.last_name, user.email, '', user.img, user.role, user._id)
    )
  }

  private generateDivisas(divisas: any[]): Divisa[]{
    console.log('users',divisas);

    return divisas.map(
      divisa => new Divisa(divisa.name, divisa.abbreviation_name, divisa._id)
    )
  }

  search(type:string, term:string){
      return this._http.get<any[]>(`${base_url}/search/${type}/${term}`,this.headers)
              .pipe(
                map((resp:any) => {
                  switch(type){
                    case 'users':
                      console.log(resp);
                      return this.generateUsers(resp.resultados)
                      case 'divisas':
                      console.log(resp);
                      return this.generateDivisas(resp.resultados)
                    default:
                      return []
                  }
                })
              )
  }
}
