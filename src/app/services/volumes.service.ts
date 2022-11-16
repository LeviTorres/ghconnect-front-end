import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class VolumesService {

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

  createDivisa(formData: any) {
    return this._http.post(`${base_url}/divisas`, formData, this.headers)
  }

  updateDivisa(formData: any, _id:string) {
    return this._http.put(`${base_url}/divisas/${ _id}`, formData, this.headers)
  }

  getDivisas(){
    return this._http.get(`${base_url}/divisas`,this.headers)
              .pipe(
                map((resp:any) => resp.divisas)
              )
  }

  deleteDivisa(divisa:any){
    return this._http.delete(`${base_url}/divisas/${divisa._id}`,this.headers)
  }

}
