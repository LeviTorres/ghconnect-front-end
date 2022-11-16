import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Exchange } from '../models/Exchange.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class ExchangesService {
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

  createExchange(formData: any) {
    return this._http.post(`${base_url}/exchanges`, formData, this.headers)
  }

  updateExchange(formData: any, _id:string) {
    return this._http.put(`${base_url}/exchanges/${ _id}`, formData, this.headers)
  }

  getExchanges(){
    return this._http.get(`${base_url}/exchanges`,this.headers)
              .pipe(
                map((resp:any) => resp.exchanges)
              )
  }

  deleteExchange(exchange:Exchange){
    return this._http.delete(`${base_url}/exchanges/${exchange._id}`,this.headers)
  }
}
