import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { TravelRequest } from '../models/TravelRequest.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class TravelRequestService {
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

  createTravelRequest(formData: any) {
    return this._http.post(`${base_url}/travel-request`, formData, this.headers)
  }

  updateTravelRequest(formData: any, _id:string) {
    return this._http.put(`${base_url}/travel-request/${ _id}`, formData, this.headers)
  }

  getTravelRequest(){
    return this._http.get(`${base_url}/travel-request`,this.headers)
              .pipe(
                map((resp:any) => {
                  return resp.travels
                })
              )
  }

  deleteTravelRequest(travel: TravelRequest){
    return this._http.delete(`${base_url}/travel-request/${travel._id}`,this.headers)
  }
}
