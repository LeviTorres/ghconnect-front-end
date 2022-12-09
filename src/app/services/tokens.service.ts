import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class TokensService {

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

  createToken(formData: any) {
    return this._http.post(`${base_url}/tokens`, formData, this.headers)
  }

  updateToken(formData: any, _id:string) {
    return this._http.put(`${base_url}/tokens/${ _id}`, formData, this.headers)
  }

  getTokens(){
    return this._http.get(`${base_url}/tokens`,this.headers)
              .pipe(
                map((resp:any) => {
                  return resp.tokens
                })
              )
  }

  deleteToken(provider: any){
    return this._http.delete(`${base_url}/tokens/${provider._id}`,this.headers)
  }
}
