import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { MovementType } from '../models/MovementType.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class MovementsTypeService {
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

  getMovementsType(){
    return this._http.get(`${base_url}/movements-type`,this.headers)
              .pipe(
                map((resp:any) =>  {
                  return resp.movementtype
                })
              )
  }

  createMovementType(formData: any) {
    return this._http.post(`${base_url}/movements-type`, formData, this.headers)
  }

  updateMovementType(formData: any, _id:string) {
    return this._http.put(`${base_url}/movements-type/${ _id}`, formData, this.headers)
  }

  deleteMovementType(movementType: MovementType){
    return this._http.delete(`${base_url}/movements-type/${movementType._id}`,this.headers)
  }

}
