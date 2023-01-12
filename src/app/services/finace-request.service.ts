import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FinaceRequestService {
  constructor(private _http: HttpClient) {}

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

  createFinaceRequest(formData: any) {
    return this._http.post(
      `${base_url}/finace-request`,
      formData,
      this.headers
    );
  }

  updateFinaceRequest(formData: any, _id: string) {
    return this._http.put(
      `${base_url}/finace-request/${_id}`,
      formData,
      this.headers
    );
  }

  getFinaceRequest() {
    return this._http.get(`${base_url}/finace-request`, this.headers).pipe(
      map((resp: any) => {
        return resp.finaces;
      })
    );
  }

  deleteFinaceRequest(finace: any) {
    return this._http.delete(
      `${base_url}/finace-request/${finace._id}`,
      this.headers
    );
  }

  getUpdateFinaceRequest(formData: any) {
    const findRefused = formData.authorizers.find(
      (finaceRequest: any) => finaceRequest.status === 'CANCELLED'
    );
    if (findRefused) {
      if (formData.status != 'REFUSED') {
        const element = {
          ...formData,
          status: 'REFUSED',
        };
        this.updateFinaceRequest(element, formData._id!).subscribe(() => {});
      }
    } else {
      if (formData.status === 'SEND') {
        const findStatus = formData.authorizers.filter(
          (finaceRequest: any) =>
            finaceRequest.required === true &&
            finaceRequest.status === 'ACCEPTED'
        );

        const findRequired = formData.authorizers.filter(
          (finaceRequest: any) =>
            finaceRequest.required === true
        );

        if(findRequired.length === findStatus.length){
          const element = {
            ...formData,
            status: 'PASSED',
          };
          this.updateFinaceRequest(element, formData._id!).subscribe(() => {});
        }
      }
    }
  }
}
