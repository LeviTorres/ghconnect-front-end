import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';
import { tap, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _loginService: LoginService,
    private _router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
      const url = state.url.includes('login')
    return this._loginService.validarToken()
            .pipe(
              tap(authentication => {
                if(!authentication){
                  this._router.navigateByUrl('/login')
                }
              })
            );
  }

}
