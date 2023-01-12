import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class PaymentConditionsService {
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

  getPaymentConditions(){
    return this._http.get(`${base_url}/payment-conditions`,this.headers)
              .pipe(
                map((resp:any) =>  {
                  return resp.paymentconditions
                })
              )
  }

}
