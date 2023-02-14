import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/User.model';
import { UsersService } from '../../../../services/users.service';
import { LoginService } from '../../../../services/login.service';
import { BusinessService } from 'src/app/services/business.service';
import { Business } from 'src/app/models/Business.model';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { SearchService } from 'src/app/services/search.service';
import { TenantsModule } from '../../tenants.module';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url
@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss']
})
export class TenantsComponent implements OnInit {

  public user!: any

  public business: Business[] = [];

  public contadorGlobal: number = 0;

  public tenants: any[] = []
  public tenantsTemp: any[] = []
  public _id!: any
  public data: any[] = []

  constructor(
    private _businessService: BusinessService,
    private _userService: UsersService,
    private _loginService: LoginService,
    private _searchService: SearchService,
    private _router: Router,
    private _spinner: NgxSpinnerService
  ) { this._spinner.show() }

  ngOnInit(): void {
    this.getUsers()
  }
  getUsers() {
    this._userService.getUsers().subscribe((users: User[]) => {
      this.user = users.find((user: User) => user._id === this._loginService.uid)
      this.tenants = this.user.tenant
      this.tenantsTemp = this.user.tenant
      this._spinner.hide()
    })
  }

  async goToHomeWithTenant(id: string) {
    this._spinner.show()
    localStorage.setItem('tenant', id)
    this._router.navigateByUrl('/home')
  }

  search(term: string) {
    if (term) {
      const termino = term.toLowerCase().trim()
      let data = this.tenantsTemp.filter((item: any) => item.tenant_id.name.toLowerCase().trim().includes(termino) || item.tenant_id.name_short.toLowerCase().trim().includes(termino))
      this.tenants = data
    } else {
      this.tenants = this.tenantsTemp
    }
  }

  getImage(image?: string) {
    if (image) {
      return `${base_url}/upload/business/${image}`
    } else {
      return `${base_url}/upload/business/image`
    }
  }

  logOut() {
    this._loginService.logout()
    this._router.navigateByUrl('/login')
  }
}
