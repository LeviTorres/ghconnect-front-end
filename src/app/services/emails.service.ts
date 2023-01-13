import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class EmailsService {

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

  sendEmail(formData: any) {
    return this._http.post(`${base_url}/mailer/travel-request`, formData,this.headers)
  }

  sendEmailFianceRequest(formData: any) {
    return this._http.post(`${base_url}/mailer/fiances-request`, formData,this.headers)
  }

}
