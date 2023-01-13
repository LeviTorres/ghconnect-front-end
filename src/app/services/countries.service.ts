import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Country } from '../models/Country.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(
    private _http: HttpClient
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get tenant(): any{
    return localStorage.getItem('tenant')|| ''
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token,
        'tenant': this.tenant
      }
    }
  }

  createCountry(formData: any) {
    return this._http.post(`${base_url}/countries`, formData, this.headers)
  }

  updateCountry(formData: any, _id:string) {
    return this._http.put(`${base_url}/countries/${ _id}`, formData, this.headers)
  }

  getCountries(){
    return this._http.get(`${base_url}/countries`,this.headers)
              .pipe(
                map((resp:any) => resp.countries)
              )
  }

  deleteCountry(country:Country){
    return this._http.delete(`${base_url}/countries/${country._id}`,this.headers)
  }
}
