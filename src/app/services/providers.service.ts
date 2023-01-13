import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Provider } from '../models/Provider.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {

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

  createProvider(formData: any) {
    return this._http.post(`${base_url}/providers`, formData, this.headers)
  }

  updateProvider(formData: any, _id:string) {
    return this._http.put(`${base_url}/providers/${ _id}`, formData, this.headers)
  }

  getProviders(){
    return this._http.get(`${base_url}/providers`,this.headers)
              .pipe(
                map((resp:any) => {
                  return resp.providers
                })
              )
  }

  getProvidersClients(){
    return this._http.get(`${base_url}/providers/providers-clients`,this.headers)
              .pipe(
                map((resp:any) => {
                  return resp.providersclients
                })
              )
  }

  deleteProvider(provider: Provider){
    return this._http.delete(`${base_url}/providers/${provider._id}`,this.headers)
  }
}
