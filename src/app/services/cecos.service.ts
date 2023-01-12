import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Ceco } from '../models/Ceco.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class CecosService {

  constructor(
    private _http: HttpClient
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get tenant(): any{
    return localStorage.getItem('tenant')
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token,
        'tenant': this.tenant
      }
    }
  }

  createCeco(formData: any) {
    return this._http.post(`${base_url}/cecos`, formData, this.headers)
  }

  updateCeco(formData: any, _id:string) {
    return this._http.put(`${base_url}/cecos/${ _id}`, formData, this.headers)
  }

  getCecos(){
    return this._http.get(`${base_url}/cecos`,this.headers)
              .pipe(
                map((resp:any) => resp.cecos)
              )
  }

  deleteCecos(ceco:Ceco){
    return this._http.delete(`${base_url}/cecos/${ceco._id}`,this.headers)
  }
}
