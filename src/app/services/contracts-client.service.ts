import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class ContractsClientService {
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

  getContractsClient(){
    return this._http.get(`${base_url}/contracts-client`,this.headers)
              .pipe(
                map((resp:any) =>  {
                  return resp.contractsclient
                })
              )
  }
}
