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
    this._loginService.changeTenant(id)
    this._router.navigateByUrl('/home')
  }

  search(term: string) {
    if (term) {
      let data = this.tenantsTemp.filter((item: any) => item.tenant_id.name.toLowerCase().includes(term))
      this.tenants = data
      console.log(this.tenants);

    } else {
      this.tenants = this.tenantsTemp
    }
  }

}
