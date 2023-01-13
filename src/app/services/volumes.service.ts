import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import {Volume } from '../models/Volume.model'

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

  createVolume(formData: any) {
    return this._http.post(`${base_url}/volumes`, formData, this.headers)
  }

  updateVolume(formData: any, _id:string) {
    return this._http.put(`${base_url}/volumes/${ _id}`, formData, this.headers)
  }

  getVolumes(){
    return this._http.get(`${base_url}/volumes`,this.headers)
              .pipe(
                map((resp:any) => resp.volumes)
              )
  }

  deleteVolume(volume:Volume){
    return this._http.delete(`${base_url}/volumes/${volume._id}`,this.headers)
  }

}
