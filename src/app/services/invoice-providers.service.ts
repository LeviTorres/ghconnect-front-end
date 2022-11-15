import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class InvoiceProvidersService {

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

  createInvoiceProvider(formData: any) {
    return this._http.post(`${base_url}/invoice-providers`, formData, this.headers)
  }

  updateInvoiceProvider(formData: any, _id:string) {
    return this._http.put(`${base_url}/invoice-providers/${ _id}`, formData, this.headers)
  }

  getInvoiceProviders(){
    return this._http.get(`${base_url}/invoice-providers`,this.headers)
              .pipe(
                map((resp:any) => {
                 console.log(resp.invoiceProviders);
                  return resp.invoiceProviders
                })
              )
  }

  deleteInvoiceProvider(invoiceProvider:any){
    return this._http.delete(`${base_url}/invoice-providers/${invoiceProvider._id}`,this.headers)
  }
}
