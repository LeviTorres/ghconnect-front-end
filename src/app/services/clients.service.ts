import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Client } from '../models/Client.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

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

  createClient(formData: any) {
    return this._http.post(`${base_url}/clients`, formData, this.headers)
  }

  updateClient(formData: any, _id:string) {
    return this._http.put(`${base_url}/clients/${ _id}`, formData, this.headers)
  }

  getClients(){
    return this._http.get(`${base_url}/clients`,this.headers)
              .pipe(
                map((resp:any) => resp.clients)
              )
  }

  deleteClient(client: Client){
    return this._http.delete(`${base_url}/clients/${client._id}`,this.headers)
  }
}
