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

  public business: Business[] = []

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

  get tenant(): any{
    return localStorage.getItem('tenant') || ''
  }

  get tenantName():any {
    return localStorage.getItem('name-tenant') || ''
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
    return this._http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap((resp:any) => {
        const {email, last_name, name, role, _id, img, tenant } = resp.user
        console.log(tenant);
        console.log(this.tenant);
        const findBusiness = tenant.find((tenant:any) => this.tenant === tenant.tenant_id)
         console.log(findBusiness);

        this.user = new User(name, last_name, email, findBusiness,'', img, role, _id)
        console.log('this.user',this.user);

        const verifyTenant = localStorage.getItem('tenant')
        if(!verifyTenant){
          localStorage.setItem('tenant', tenant[0].tenant_id)
          this._businessService.getBusinessById(tenant[0].tenant_id).subscribe((resp:any) => {
            localStorage.setItem('name-tenant', resp.name_short)
            this.name = resp.name_short
           })
        }else {
          this.name = localStorage.getItem('name-tenant')
        }
        localStorage.setItem('token', resp.token)
      }),
      map( resp => true),
      catchError(error => of(false))
    )
  }

  changeTenant(tenant:any):any{
    this._spinner.show()
    localStorage.setItem('tenant', tenant)
    this._businessService.getBusinessById(tenant).subscribe((resp:any) => {
      localStorage.setItem('name-tenant', resp.name_short)
      this.name = resp.name_short
      this._spinner.hide()
     })
  }

  async nameTenant(id: any){
    let name
    await this._businessService.getBusinessById(id).subscribe((resp:any) => {
      //localStorage.setItem('name-tenant', resp.name_short)
      console.log('resp',resp);

      name = resp.name_short
     })
     console.log(name);

     return name
  }

  logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('tenant')
    localStorage.removeItem('name-tenant')
  }
}
