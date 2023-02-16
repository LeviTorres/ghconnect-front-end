import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MovementTypeClient } from '../models/MovementTypeClient.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MovementsTypeProviderService {
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

  getMovementsTypeProvider() {
    return this._http
      .get(`${base_url}/movements-type-provider`, this.headers)
      .pipe(
        map((resp: any) => {
          console.log('resp',resp);

          return resp.movementtypeprovider;
        })
      );
  }

  getMovementsTypeProviderActive() {
    return this._http
      .get(`${base_url}/movements-type-provider/active`, this.headers)
      .pipe(
        map((resp: any) => {
          console.log('resp',resp);

          return resp.movementtypeprovider;
        })
      );
  }

  createMovementTypeProvider(formData: any) {
    return this._http.post(
      `${base_url}/movements-type-provider`,
      formData,
      this.headers
    );
  }

  updateMovementTypeProvider(formData: any, _id: string) {
    return this._http.put(
      `${base_url}/movements-type-provider/${_id}`,
      formData,
      this.headers
    );
  }

  deleteMovementTypeProvider(movementType: MovementTypeClient) {
    return this._http.delete(
      `${base_url}/movements-type-provider/${movementType._id}`,
      this.headers
    );
  }
}
