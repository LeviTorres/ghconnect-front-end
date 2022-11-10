import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Business } from '../modules/business/models/Business.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

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

  createBusiness(formData: any) {
    return this._http.post(`${base_url}/business`, formData, this.headers)
  }

  updateBusiness(formData: any, _id:string) {
    return this._http.put(`${base_url}/business/${ _id}`, formData, this.headers)
  }

  getBusiness(){
    return this._http.get(`${base_url}/business`,this.headers)
              .pipe(
                map((resp:any) => resp.business)
              )
  }

  deleteBusiness(business:Business){
    return this._http.delete(`${base_url}/business/${business._id}`,this.headers)
  }
}
