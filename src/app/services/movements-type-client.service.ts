import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MovementTypeProvider } from '../models/MovementTypeProvider.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MovementsTypeClientService {
  constructor(private _http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get tenant(): any {
    return localStorage.getItem('tenant');
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
        'tenant': this.tenant,
      },
    };
  }

  getMovementsTypeClient() {
    return this._http
      .get(`${base_url}/movements-type-client`, this.headers)
      .pipe(
        map((resp: any) => {
          return resp.movementtypeclient;
        })
      );
  }

  getMovementsTypeClientActive() {
    return this._http
      .get(`${base_url}/movements-type-client/active`, this.headers)
      .pipe(
        map((resp: any) => {
          return resp.movementtypeclient;
        })
      );
  }

  createMovementTypeClient(formData: any) {
    return this._http.post(
      `${base_url}/movements-type-client`,
      formData,
      this.headers
    );
  }

  updateMovementTypeClient(formData: any, _id: string) {
    return this._http.put(
      `${base_url}/movements-type-client/${_id}`,
      formData,
      this.headers
    );
  }

  deleteMovementTypeClient(movementType: MovementTypeProvider) {
    return this._http.delete(
      `${base_url}/movements-type-client/${movementType._id}`,
      this.headers
    );
  }
}
