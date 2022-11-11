import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class HeadersService {
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

  getHeaders(type:string){
    return this._http.get(`${base_url}/headers/${type}`,this.headers)
            .pipe(
              map((resp:any) => {
                return resp.headers
              })
            )
  }

  createHeaders(formData: any, type:string) {
    return this._http.post(`${base_url}/headers/${type}`, formData, this.headers)
  }

  updateHeaders(formData: any, _id:string, type:string) {
    return this._http.put(`${base_url}/headers/${type}/${ _id}`, formData, this.headers)
  }
}
