import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { InvoiceClient } from '../models/InvoiceClients.model';


const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class InvoiceClientsService {

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

  createInvoiceClient(formData: any) {
    return this._http.post(`${base_url}/invoice-clients`, formData, this.headers)
  }

  updateInvoiceClient(formData: any, _id:string) {
    return this._http.put(`${base_url}/invoice-clients/${ _id}`, formData, this.headers)
  }

  getInvoiceClients(){
    return this._http.get(`${base_url}/invoice-clients`,this.headers)
              .pipe(
                map((resp:any) => {
                 console.log(resp.invoiceClients);
                  return resp.invoiceClients
                })
              )
  }

  deleteInvoiceClient(invoiceClient:InvoiceClient){
    return this._http.delete(`${base_url}/invoice-clients/${invoiceClient._id}`,this.headers)
  }
}
