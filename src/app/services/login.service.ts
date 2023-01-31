import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map, catchError } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { User } from '../models/User.model';
import { UsersService } from './users.service';
import { BusinessService } from './business.service';
import { Business } from '../models/Business.model';
import { NgxSpinnerService } from 'ngx-spinner';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public user!: User

  public business!: Business

  public name!: any

  constructor(
    private _http:HttpClient,
    private _businessService:BusinessService,
    private _spinner: NgxSpinnerService
  ) {
  }

  get uid():string {
    return this.user._id || '';
  }

  get tenantName(): any{
    return this.business.name_short
  }

  get tenant(): any{
    return localStorage.getItem('tenant') || ''
  }

  login(formData: any){
    return this._http.post(`${base_url}/login`, formData)
          .pipe(
            tap((resp:any) => {
              localStorage.setItem('token', resp.token)
            })
          )
  }

  validarToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || ''
    const tenant = localStorage.getItem('tenant') || ''
    return this._http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token,
        'tenant': tenant
      }
    }).pipe(
      tap((resp:any) => {
        const {email, last_name, name, role, _id, img, tenant } = resp.user
        const { name_business, name_short, creation_date, key_business} = resp.business
        this.user = new User(name, last_name, email, tenant,'', img, role, _id)
        this.business = new Business(name_business, name_short, creation_date, key_business)
        localStorage.setItem('name-tenant', this.business.name_short)
        localStorage.setItem('tenant', resp.business._id)
        localStorage.setItem('token', resp.token)
      }),
      map( resp => true),
      catchError(error => of(false))
    )
  }

  changeTenant(tenant:any):any{
    localStorage.setItem('tenant', tenant)
  }

  logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('tenant')
    localStorage.removeItem('name-tenant')
  }
}
