import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class ContractsProviderService {
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

  getContractsProvider(){
    return this._http.get(`${base_url}/contracts-provider`,this.headers)
              .pipe(
                map((resp:any) =>  {
                  return resp.contractsprovider
                })
              )
  }
}
