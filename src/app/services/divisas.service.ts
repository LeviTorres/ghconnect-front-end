import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Divisa } from '../models/Divisa.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class DivisasService {

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

  createDivisa(formData: any) {
    return this._http.post(`${base_url}/divisas`, formData, this.headers)
  }

  updateDivisa(formData: any, _id:string) {
    return this._http.put(`${base_url}/divisas/${ _id}`, formData, this.headers)
  }

  getDivisas(){
    return this._http.get(`${base_url}/divisas`,this.headers)
              .pipe(
                map((resp:any) => resp.divisas)
              )
  }

  deleteDivisa(divisa:Divisa){
    return this._http.delete(`${base_url}/divisas/${divisa._id}`,this.headers)
  }

}
